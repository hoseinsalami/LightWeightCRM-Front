import {BaseSaveManager} from "../../../../_classes/base-save.manager";
import {LoadingService} from "../../../../_services/loading.service";
import {ActivitiesService} from "../../../_services/activities.service";
import {ActivatedRoute} from "@angular/router";


export class BaseActivitiesDetailComponent<T> {

  icons = [
    { icon: 'pi pi-at', label: 'At Symbol' },
    { icon: 'pi pi-bolt', label: 'Bolt' },
    { icon: 'pi pi-briefcase', label: 'Briefcase' },
    { icon: 'pi pi-building', label: 'Building' },
    { icon: 'pi pi-box', label: 'box' },
    { icon: 'pi pi-bookmark-fill', label: 'bookmark-fill' },
    { icon: 'pi pi-bookmark', label: 'bookmark' },
    { icon: 'pi pi-list', label: 'list' },
    { icon: 'pi pi-link', label: 'link' },
    { icon: 'pi pi-server', label: 'server' },
    { icon: 'pi pi-calculator', label: 'calculator' },
    { icon: 'pi pi-calendar', label: 'calendar' },
    { icon: 'pi pi-car', label: 'car' },
    { icon: 'pi pi-camera', label: 'camera' },
    { icon: 'pi pi-calendar-plus', label: 'calendar-plus' },
    { icon: 'pi pi-check', label: 'check' },
    { icon: 'pi pi-chart-bar', label: 'chart-bar' },
    { icon: 'pi pi-chart-pie', label: 'chart-pie' },
    { icon: 'pi pi-chart-line', label: 'chart-line' },
    { icon: 'pi pi-clone', label: 'clone' },
    { icon: 'pi pi-clock', label: 'clock' },
    { icon: 'pi pi-cloud', label: 'cloud' },
    { icon: 'pi pi-cog', label: 'cog' },
    { icon: 'pi pi-flag-fill', label: 'flag-fill' },
    { icon: 'pi pi-credit-card', label: 'credit-card' },
    { icon: 'pi pi-compass', label: 'compass' },
  ]
  selectedIndex: number | null = null;

  isId?: string;
  constructor(protected manager: BaseSaveManager<T>,
              activityService: ActivitiesService,
              protected loading: LoadingService,
              protected activeRoute: ActivatedRoute) {
    this.isId = this.activeRoute.snapshot.params['id'];
  }

  // protected  mode?:'New'|'Edit';
  protected onClick(index: number): void {
    if (this.selectedIndex === index) {
      this.selectedIndex = null;
    } else {
      this.selectedIndex = index;
    }
  }

}
