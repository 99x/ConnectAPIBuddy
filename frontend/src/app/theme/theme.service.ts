import { Injectable } from '@angular/core';
import { Theme, light, dark } from './theme';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private active: Theme = light;
  private availableThemes: Theme[] = [light, dark];

  getAvailableThemes(): Theme[] {
    return this.availableThemes;
  }

  getActiveTheme(): string {
    return this.active.name;
  }

  isDarkTheme(): boolean {
    return this.active.name === dark.name;
  }

  setDarkTheme(): void {
    this.setActiveTheme('dark');
  }

  setLightTheme(): void {
    this.setActiveTheme('light');
  }

  setActiveTheme(theme: string): void {
    this.active = this.availableThemes[this.availableThemes.findIndex(x => x.name === theme)];

    Object.keys(this.active.properties).forEach(property => {
      document.documentElement.style.setProperty(
        property,
        this.active.properties[property]
      );
    });
  }
}
