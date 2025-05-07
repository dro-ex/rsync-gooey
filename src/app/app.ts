import { html, css, LitElement, unsafeCSS } from 'lit';
import { customElement, query } from 'lit/decorators.js';
import { Router } from '@vaadin/router';
import { routes } from './app-routing.js';
import { defineComponents, IgcIconButtonComponent, IgcIconComponent, IgcNavbarComponent, IgcNavDrawerComponent, IgcRippleComponent } from 'igniteui-webcomponents';
import baseStyles from '/src/app/base-view-styles.css?inline';

defineComponents(IgcNavbarComponent, IgcIconButtonComponent, IgcIconComponent, IgcRippleComponent, IgcNavDrawerComponent);

@customElement('app-root')
export default class App extends LitElement {
  static styles = css`
    :host {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: stretch;
      align-content: flex-start;
    }
    .navbar {
      color: var(--ig-gray-900);
      background-color: var(--ig-primary-600);
      height: max-content;
      min-width: min-content;
    }
    .nav-drawer {
      min-width: min-content;
      min-height: 0;
      max-width: 187px;
      flex-shrink: 0;
    }
    .view-container {
      overflow: auto;
      display: block;
      position: relative;
      flex-grow: 1;
    }
    .nav-drawer::part(main) {
      width: 187px;
    }
    .h6 {
      margin: 0;
      flex-shrink: 0;
    }
    .icon {
      --size: 24px;
      font-size: 24px;
      width: 24px;
      height: 24px;
    }
    .row-layout {
      display: flex;
    }
    .group {
      justify-content: flex-start;
      align-items: center;
      align-content: flex-start;
      gap: 1rem;
      overflow: hidden;
    }
    .group_1 {
      justify-content: flex-start;
      align-items: stretch;
      align-content: flex-start;
      position: relative;
      min-width: 50px;
      min-height: 50px;
      flex-grow: 1;
    }
  `;

  @query('#nav-drawer')
  private navDrawer?: IgcNavDrawerComponent;

  render() {
    return html`
      <link href='https://fonts.googleapis.com/icon?family=Material+Icons' rel='stylesheet'>
      <style>${unsafeCSS(baseStyles)}</style>
      <igc-navbar class="navbar">
        <igc-icon-button slot="start" variant="flat" @click="${() => this.navDrawer?.toggle()}">
          <span class="material-icons">
            menu
          </span>
          <igc-ripple></igc-ripple>
        </igc-icon-button>
        <div class="row-layout group">
          <h6 class="h6">
            rsync Gooey
          </h6>
        </div>
        <igc-icon-button slot="end" variant="flat">
          <span class="material-icons">
            brightness_4
          </span>
          <igc-ripple></igc-ripple>
        </igc-icon-button>
      </igc-navbar>
      <div class="row-layout group_1">
        <igc-nav-drawer ?open="${true}" position="relative" id="nav-drawer" class="nav-drawer">
          <igc-nav-drawer-item @click="${() => Router.go(`/history`)}">
            <span slot="icon">
              <span class="material-icons icon">
                home
              </span>
              <igc-ripple></igc-ripple>
            </span>
            <div slot="content">View 1</div>
          </igc-nav-drawer-item>
          <igc-nav-drawer-item @click="${() => Router.go(`/tasks`)}">
            <span slot="icon">
              <span class="material-icons icon">
                dns
              </span>
              <igc-ripple></igc-ripple>
            </span>
            <div slot="content">View 2</div>
          </igc-nav-drawer-item>
          <igc-nav-drawer-item @click="${() => Router.go(`/jobs`)}">
            <span slot="icon">
              <span class="material-icons icon">
                dashboard
              </span>
              <igc-ripple></igc-ripple>
            </span>
            <div slot="content">View 3</div>
          </igc-nav-drawer-item>
        </igc-nav-drawer>
        <router-outlet class="view-container"></router-outlet>
      </div>
    `;
  }

  firstUpdated() {
    const outlet = this.shadowRoot?.querySelector('router-outlet');
    const router = new Router(outlet);
    router.setRoutes(routes);
  }
}
