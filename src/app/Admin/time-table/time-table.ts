import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
// IMPORTANT FIX: Added FormsModule to enable [(ngModel)] in the template
import { ReactiveFormsModule, FormBuilder, FormGroup, FormsModule } from '@angular/forms'; 
import { StaffService } from '../../Services/staff-service';
import { TimetableService } from '../../Services/Timetable.service';
import { staff } from '../../Models/Staff';
import { shift } from '../../Models/Shift';

@Component({
  selector: 'app-timetable',
  standalone: true,
  // IMPORTANT FIX: Added FormsModule to imports
  imports: [CommonModule, ReactiveFormsModule, FormsModule], 
  templateUrl: './time-table.html' 
})
export class TimetableComponent implements OnInit {
  // FIX 1: Declared as FormGroup, initialization moved to constructor
  shiftForm!: FormGroup; 

  staffs: staff[] = [];
  shifts: shift[] = [];
  shiftsFiltered: shift[] = [];
  departments = ['Emergency', 'ICU', 'General', 'OPD'];
  filterDepartment = '';

  // Constructor initializes FormBuilder (fb)
  constructor(private fb: FormBuilder, private staffSvc: StaffService, private ttSvc: TimetableService) {
    // FIX 1: Initialize shiftForm using the available 'fb' instance
    this.shiftForm = this.fb.group({
      staffId: [''],
      department: [{ value: '', disabled: true }], // Made department read-only
      shiftType: ['Day']
    });
  }

  ngOnInit() {
    this.loadStaffs();
    this.loadShifts();

    // auto-set department when staff selected
    // FIX 2: Type is now correctly string | null from a form control
    this.shiftForm.get('staffId')?.valueChanges.subscribe((idString: string | null) => {
      // Safely convert to number for lookup
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
    const raw = this.shiftForm.getRawValue(); // Use getRawValue to include disabled department field
    const payload: any = {
      staffId: Number(raw.staffId),
      department: raw.department,
      shiftType: raw.shiftType
    };

    this.ttSvc.create(payload).subscribe({
      next: () => {
        this.loadShifts();
        this.shiftForm.patchValue({ shiftType: 'Day' });
      },
      error: (err) => alert(err?.error?.message ?? 'Shift assignment failed')
    });
  }

  // FIX 3: Corrected parameter type to use the imported model 'shift' (lowercase)
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