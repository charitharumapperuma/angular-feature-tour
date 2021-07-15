export class Tour {
  id: string;
  isSequential: boolean;
  steps: TourStep[];
}

export class TourStep {
  id: string;
  index?: number;
  title?: string;
  message?: string;
  actions: Action[];
  enabled: boolean;
}

export class Action {
  id: string;
  disabled: boolean;
  hidden: boolean;
}
