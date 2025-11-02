import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { StaffService, Staff } from '../../ApiService/StaffService';
import { TimetableService } from '../../ApiService/Timetable.service';
import { shift } from '../../Models/Shift';

@Component({
  selector: 'app-timetable',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
  templateUrl: './time-table.html'
})
export class TimetableComponent implements OnInit, AfterViewInit {
  shiftForm!: FormGroup;
  editShiftForm!: FormGroup;
  staffs: Staff[] = [];
  shifts: shift[] = [];
  shiftsFiltered: shift[] = [];
  departments = ['Emergency', 'ICU', 'General', 'OPD', 'Support', 'Clinical', 'Cardiology'];
  filterDepartment = '';
  conflictMessage: string = '';

  @ViewChild('editShiftModal') editModalElement!: ElementRef;
  editModal: any;
  shiftToEdit: shift | null = null;

  // 🔍 Pop card state
  selectedStaffName: string = '';
  selectedDate: Date = new Date('2025-11-02');

  constructor(
    private fb: FormBuilder,
    private staffSvc: StaffService,
    private ttSvc: TimetableService
  ) {}

  ngOnInit(): void {
    this.shiftForm = this.fb.group({
      staffId: ['', Validators.required],
      department: [{ value: '', disabled: true }],
      shiftDate: ['', Validators.required],
      shiftType: [0, Validators.required]
    });

    this.editShiftForm = this.fb.group({
      shiftType: [0, Validators.required]
    });

    this.loadStaffs();
    this.loadShifts();

    this.shiftForm.get('staffId')?.valueChanges.subscribe((idString: string | null) => {
      const id = Number(idString);
      const staff = this.staffs.find(x => x.id === id);
      this.shiftForm.patchValue({ department: staff?.department ?? '' });
    });
  }

  ngAfterViewInit(): void {
    if (this.editModalElement) {
      this.editModal = new (window as any).bootstrap.Modal(this.editModalElement.nativeElement);
    }
  }

  loadStaffs(): void {
    this.staffSvc.getAll().subscribe((s: Staff[]) => {
      this.staffs = s;
    });
  }

  loadShifts(): void {
    this.ttSvc.getAll().subscribe((sh: shift[]) => {
      console.log('Loaded shifts:', sh);
      this.shifts = sh;
      this.applyFilter();
    });
  }

  applyFilter(): void {
    this.shiftsFiltered = this.filterDepartment
      ? this.shifts.filter(x => x.department === this.filterDepartment)
      : [...this.shifts];
  }

  assignShift(): void {
    const raw = this.shiftForm.getRawValue();
    const formattedDate = this.formatDate(raw.shiftDate);

    const shiftTypeToNumber = (type: string): number => type === 'Day' ? 0 : 1;

    const alreadyAssigned = this.shifts.some(s =>
      s.staffId === Number(raw.staffId) &&
      s.shiftDate === formattedDate &&
      shiftTypeToNumber(s.shiftType) === Number(raw.shiftType)
    );

    if (alreadyAssigned) {
      const staff = this.staffs.find(s => s.id === Number(raw.staffId));
      this.conflictMessage = `Staff member ${staff?.name} (No. ${staff?.id}) already has a shift assigned on ${formattedDate}.`;
      return;
    }

    const payload = {
      staffId: Number(raw.staffId),
      shiftDate: formattedDate,
      shiftType: Number(raw.shiftType)
    };

    console.log('Assigning shift with payload:', payload);

    this.ttSvc.create(payload).subscribe({
      next: () => {
        this.loadShifts();
        this.shiftForm.reset({ shiftType: 0 });
      },
      error: (err) => {
        console.error('Error assigning shift:', err);
        this.conflictMessage = err.error || 'Failed to assign shift. Please check the form and try again.';
      }
    });
  }

  formatDate(date: string | Date): string {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }

  editShift(s: shift): void {
    this.shiftToEdit = s;
    this.editShiftForm.patchValue({
      shiftType: s.shiftType === 'Day' ? 0 : 1
    });

    if (this.editModal) {
      this.editModal.show();
    }
  }

  onUpdateShift(): void {
    if (!this.shiftToEdit || !this.editShiftForm.valid) return;

    const formValue = this.editShiftForm.value;

    const updatedShift = {
      ...this.shiftToEdit,
      shiftType: Number(formValue.shiftType)
    };

    this.ttSvc.update(updatedShift).subscribe({
      next: () => {
        this.loadShifts();
        this.editModal.hide();
        this.shiftToEdit = null;
      },
      error: (err) => {
        console.error('Error updating shift:', err);
        alert(err.error || 'Failed to update shift.');
      }
    });
  }

  deleteShift(id: number): void {
    if (!confirm('Delete this shift?')) return;
    this.ttSvc.delete(id).subscribe(() => this.loadShifts());
  }

  // 🔍 Pop card logic
  showStaffShifts(name: string): void {
    console.log('Clicked:', name);
    this.selectedStaffName = name;
    this.selectedDate = new Date('2025-11-02'); // default start date
  }

  get selectedShift(): shift | null {
    return this.shifts.find(s =>
      s.staffName === this.selectedStaffName &&
      this.formatDate(s.shiftDate) === this.formatDate(this.selectedDate)
    ) ?? null;
  }

  nextDay(): void {
    this.selectedDate = new Date(this.selectedDate.getTime() + 86400000);
  }

  prevDay(): void {
    this.selectedDate = new Date(this.selectedDate.getTime() - 86400000);
  }

  closePopCard(): void {
    this.selectedStaffName = '';
  }
}
