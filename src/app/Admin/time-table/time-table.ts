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
      shiftType: [0, Validators.required], // 0 = Day, 1 = Night

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

  const payload = {
    staffId: Number(raw.staffId),
    shiftDate: raw.shiftDate,
    shiftType: raw.shiftType // ✅ Enum string
  };

  console.log('Sending payload:', payload);

  this.ttSvc.create(payload).subscribe({
    next: () => {
      this.loadShifts();
      this.shiftForm.patchValue({ shiftType: 0, shiftDate: '' });
    },
    error: (err: any) => {
      console.error('Assign failed:', err);
      alert(err?.error ?? 'Shift assignment failed');
    }
  });
}




editShift(s: shift) { 
    const newType = prompt('Edit shift type (0 = Day, 1 = Night)', String(s.shiftType));

    // Use an 'else if' or just a single 'if' to avoid running twice
    if (newType === '0' || newType === '1') {
      this.ttSvc.update({ ...s, shiftType: Number(newType) }).subscribe(() => this.loadShifts());
    } else if (newType) {
      // Handle if they typed something invalid, or just do nothing
      alert('Invalid shift type. Please enter 0 or 1.');
    }
  }

    

  deleteShift(id: number) {
    if (!confirm('Delete this shift?')) return;
    this.ttSvc.delete(id).subscribe(() => this.loadShifts());
  }
}