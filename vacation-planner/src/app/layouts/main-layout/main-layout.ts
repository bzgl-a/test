import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TopBar } from '../../components/shared/top-bar/top-bar';
import { SideMenu } from '../../components/shared/side-menu/side-menu';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, TopBar, SideMenu],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayout {}
