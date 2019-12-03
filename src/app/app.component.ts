import { Component, HostListener, OnInit } from '@angular/core';
import { ThemeService } from './theme/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'ConnectAPIBuddy';
  constructor(private themeService: ThemeService) { }

  @HostListener('window:unload', ['$event'])
  unloadHandler(event) {
    if (this.themeService.getActiveTheme()) {
      window.localStorage.setItem("selectedTheme", this.themeService.getActiveTheme());
    }
  }
  ngOnInit() {
    const theme = window.localStorage.getItem("selectedTheme");
    if (theme) {
      this.themeService.setActiveTheme(theme);
    }else {
      this.themeService.setActiveTheme('dark');
    }
  }
}
