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
  enabled?: boolean = true;
  completed?: boolean = false;
  on_complete?: string[] = []
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
