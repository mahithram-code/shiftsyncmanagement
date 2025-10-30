import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms'; 
import { StaffService } from '../../Services/staff-service';
import { TimetableService } from '../../Services/Timetable.service';
import { staff } from '../../Models/Staff';
import { shift } from '../../Models/Shift';

@Component({
  selector: 'app-timetable',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule], 
  templateUrl: './time-table.html' 
})
export class TimetableComponent implements OnInit {
  shiftForm!: FormGroup; 

  staffs: staff[] = [];
  shifts: shift[] = [];
  shiftsFiltered: shift[] = [];
  departments = ['Emergency', 'ICU', 'General', 'OPD'];
  filterDepartment = '';

  constructor(
    private fb: FormBuilder,
    private staffSvc: StaffService,
    private ttSvc: TimetableService
  ) {
    this.shiftForm = this.fb.group({
      staffId: ['', Validators.required],
      department: [{ value: '', disabled: true }],
      shiftType: ['Day', Validators.required],
      shiftDate: ['', Validators.required]  // ✅ Added date field
    });
  }

  ngOnInit() {
    this.loadStaffs();
    this.loadShifts();

    this.shiftForm.get('staffId')?.valueChanges.subscribe((idString: string | null) => {
      const id = Number(idString); 
      const s = this.staffs.find(x => x.id === id); 
      this.shiftForm.patchValue({ department: s?.department ?? '' });
    });
  }

  loadStaffs() {
    this.staffSvc.getAll().subscribe(s => this.staffs = s);
  }

  loadShifts() {
    this.ttSvc.getAll().subscribe(s => {
      this.shifts = s;
      this.applyFilter();
    });
  }

  applyFilter() {
    this.shiftsFiltered = this.filterDepartment
      ? this.shifts.filter(x => x.department === this.filterDepartment)
      : [...this.shifts];
  }

  assignShift() {
    const raw = this.shiftForm.getRawValue();
    const payload: any = {
      staffId: Number(raw.staffId),
      department: raw.department,
      shiftType: raw.shiftType,
      shiftDate: raw.shiftDate  // ✅ Include date in payload
    };

    this.ttSvc.create(payload).subscribe({
      next: () => {
        this.loadShifts();
        this.shiftForm.patchValue({ shiftType: 'Day', shiftDate: '' });
      },
      error: (err) => alert(err?.error?.message ?? 'Shift assignment failed')
    });
  }

  editShift(s: shift) { 
    const newType = prompt('Edit shift type (Day / Night)', s.shiftType);
    if (newType) {
      this.ttSvc.update({ ...s, shiftType: newType }).subscribe(() => this.loadShifts());
    }
  }

  deleteShift(id: number) {
    if (!confirm('Delete this shift?')) return;
    this.ttSvc.delete(id).subscribe(() => this.loadShifts());
  }
}
