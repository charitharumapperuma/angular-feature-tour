export class Tour {
  id: string;
  isSequence?: boolean;
  persist?: string;
  disabled?: boolean;
  steps: TourStep[];
  completeness_test_fn?: () => boolean;
}

export class TourStep {
  id: string;
  index?: number;
  title?: string;
  message?: string;
  disabled?: boolean;
  completed?: boolean;
  persist?: boolean;
  on_complete?: string[] = [];
  completeness_test_fn?: () => boolean;
}

export class TourAction {
  id: string;
  disabled: boolean;
  hidden: boolean;
  data?: any;
}

export class TourActionEvent {
  id: string;
  data: any;
}
