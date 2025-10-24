import { Component, inject } from '@angular/core';
import { LoadingService } from '../../../core/services/loading.service';
import { SharedModule } from '../../shared.module';

@Component({
  selector: 'app-global-loading',
  imports: [SharedModule],
  templateUrl: './global-loading.component.html',
  styleUrls: ['./global-loading.component.scss'],
})
export class GlobalLoadingComponent {
  protected readonly loadingService = inject(LoadingService);
}
