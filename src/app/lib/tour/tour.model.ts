export class Tour {
  id: string;
  isSequence: boolean;
  steps: TourStep[];
}

export class TourStep {
  id: string;
  index?: number;
  title?: string;
  message?: string;
  disabled?: boolean;
  completed?: boolean;
  on_complete?: string[] = [];
  persist?: boolean;
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
