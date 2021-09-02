// Angular built-in modules
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

// App modules
import { OneDeviceRoutingModule } from './one-device-routing.module';

// Material Design modules
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card'; 
import { MatDialogModule } from '@angular/material/dialog'; 
import { MatExpansionModule } from '@angular/material/expansion'; 
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTabsModule } from '@angular/material/tabs'; 

// Other UI modules
import { SwiperModule } from 'swiper/angular';

export const oneDeviceModuleImports = [
  CommonModule,
  ReactiveFormsModule,
  OneDeviceRoutingModule,
  MatButtonModule,
  MatCardModule,
  MatDialogModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatTabsModule,
  SwiperModule
];
