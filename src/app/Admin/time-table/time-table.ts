import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms'; 
// FIX: Import the correct StaffService and Staff model from ApiService
import { StaffService, Staff } from '../../ApiService/StaffService';
// FIX: Corrected import path for TimetableService
import { TimetableService } from '../../Services/Timetable.service';
// FIX: Removed the old, incorrect staff model
// import { staff } from '../../Models/Staff'; 
import { shift } from '../../Models/Shift';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-timetable',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule], 
  templateUrl: './time-table.html' 
})
export class TimetableComponent implements OnInit {
  shiftForm!: FormGroup; 

  // FIX: Use the correct Staff interface (imported from ApiService)
  staffs: Staff[] = []; 
  shifts: shift[] = [];
  shiftsFiltered: shift[] = [];
  departments = ['Emergency', 'ICU', 'General', 'OPD'];
  filterDepartment = '';

  constructor(
    private fb: FormBuilder,
    private staffSvc: StaffService, // This is now the correct StaffService
    private ttSvc: TimetableService
  ) {
    this.shiftForm = this.fb.group({
      staffId: ['', Validators.required],
      department: [{ value: '', disabled: true }],
      shiftType: ['Day', Validators.required],
      shiftDate: ['', Validators.required]
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
    // FIX: Add explicit type (Staff[]) to 's' to resolve TS7006
    this.staffSvc.getAll().subscribe((s: Staff[]) => this.staffs = s);
  }

  loadShifts() {
    // FIX: Add explicit type (shift[]) to 's' to resolve TS7006
    this.ttSvc.getAll().subscribe((s: shift[]) => {
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
      shiftDate: raw.shiftDate
    };

    this.ttSvc.create(payload).subscribe({
      next: () => {
        this.loadShifts();
        this.shiftForm.patchValue({ shiftType: 'Day', shiftDate: '' });
      },
      // FIX: Add explicit type 'any' to 'err' to resolve TS7006
      error: (err: any) => alert(err?.error?.message ?? 'Shift assignment failed')
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