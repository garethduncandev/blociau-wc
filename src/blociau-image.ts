import { Blociau, RectStyle } from 'blociau';
import { LitElement, TemplateResult, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { until } from 'lit/directives/until.js';

/**
 * Blociau element
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('blociau-img')
export class BlociauImage extends LitElement {
  public static styles = css`
    :host {
      display: inline-block;
    }

    svg {
      height: 100%;
      width: 100%;
    }
  `;

  @property({ type: String })
  public id!: string;

  @property({ type: String })
  public imgSrc!: string;

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

  @property({ type: Number })
  public imgWidth?: number;

  @property({ type: Number })
  public imgHeight?: number;

  public render(): TemplateResult<1> {
    return html`${until(this.createSvg())}`;
  }

  private async createSvg(): Promise<SVGSVGElement> {
    const blocks = new Blociau(
      this.codeBlockHeight,
      this.rectStyles,
      this.padding
    );

    const img = await this.loadImage(this.imgSrc);

    // overide original image size if requested
    if (this.imgWidth) img.width = this.imgWidth;
    if (this.imgHeight) img.height = this.imgHeight;

    const svg = blocks.fromImage(this.id, img);

    if (this.animation) {
      const animateCss = blocks.animate(
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

  private async loadImage(imgSrc: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = (): void => resolve(img);
      img.onerror = reject;
      img.src = imgSrc;
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'blociau-img': BlociauImage;
  }
}
