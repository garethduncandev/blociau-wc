import { Blociau, RectStyle } from 'blociau';
import { LitElement, TemplateResult, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/**
 * Blociau element
 */
@customElement('blociau-rect')
export class BlociauRect extends LitElement {
  public static styles = css`
    :host {
      display: inline-block;
      height: var(--result-height);
      width: var(--result-width);
    }
  `;

  @property({ type: String })
  public id!: string;

  @property({ type: Number })
  public height: number = 100;

  @property({ type: Number })
  public width: number = 100;

  @property({ type: Number })
  public codeBlockHeight: number = 10;

  @property({ type: Array })
  public rectStyles: RectStyle[] = [
    { width: 10, color: 'red', borderRadius: 0.1 },
    { width: 20, color: 'green', borderRadius: 0.1 },
    { width: 30, color: 'blue', borderRadius: 0.1 },
  ];

  @property({ type: Number })
  public padding: number = 1;

  @property({ type: Boolean })
  public animation: boolean = false;

  @property({ type: Number })
  public animationDelay: number = 0;

  @property({ type: Number })
  public speed: number = 0.2;

  public render(): TemplateResult<1> {
    return html`${this.createSvg()}`;
  }

  private createSvg(): SVGSVGElement {
    // update host width and height based on image size
    // this allows us to have a default style that can be overridden by
    // the consuming app
    this.style.setProperty('--result-height', `${this.height}px`);
    this.style.setProperty('--result-width', `${this.width}px`);

    const blociau = new Blociau(
      this.codeBlockHeight,
      this.rectStyles,
      this.padding
    );

    const svg = blociau.fromDimensions(this.id, this.width, this.height);

    if (this.animation) {
      const animateCss = blociau.animate(
        this.id,
        svg,
        this.speed,
        this.animationDelay
      );
      const style = document.createElement('style');
      style.textContent = animateCss.cssRules.toString();
      this.shadowRoot?.prepend(style);
    }

    return svg;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'blociau-rect': BlociauRect;
  }
}
