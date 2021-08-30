// Angular built-in modules
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

// App modules
import { OneDeviceRoutingModule } from './one-device-routing.module';

// Material Design modules
import { MatCardModule } from '@angular/material/card'; 
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export const oneDeviceModuleImports = [
  CommonModule,
  ReactiveFormsModule,
  OneDeviceRoutingModule,
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule,
  MatIconModule,
];
