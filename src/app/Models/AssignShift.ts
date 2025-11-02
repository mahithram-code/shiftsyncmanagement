export interface AssignShiftRequestDto {
  staffId: number;
  shiftDate: string; // 'YYYY-MM-DD'
  shiftType: number; // 0 = Day, 1 = Night
}
