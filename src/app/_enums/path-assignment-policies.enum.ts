export enum PathAssignmentPoliciesEnum {
  NoAssignment,
  LeastBusyFirst
}

export const PathAssignmentPoliciesEnum2LabelMapping: Record<PathAssignmentPoliciesEnum, string> = {
  [PathAssignmentPoliciesEnum.NoAssignment]: 'فاقد انتساب',
  [PathAssignmentPoliciesEnum.LeastBusyFirst]: 'کم مشغله ترین',
}
