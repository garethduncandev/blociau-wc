import { Blociau, type BlociauStyle } from 'blociau';
import { LitElement, TemplateResult, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { until } from 'lit/directives/until.js';

/**
 * Blociau element
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('blociau-svg')
export class BlociauSVG extends LitElement {
  /**
   * Copy for the read the docs hint.
   */
  @property({ type: String })
  public id!: string;

  @property({ type: String })
  public imgSrc!: string;

  @property({ type: Number })
  public codeBlockHeight!: number;

  @property({ type: Array })
  public styles!: BlociauStyle[];

  @property({ type: Number })
  public padding: number = 1;

  @property({ type: Boolean })
  public animation: boolean = false;

  @property({ type: Number })
  public animationDelay: number = 0;

  @property({ type: Number })
  public speed: number = 0.2;

  public render(): TemplateResult<1> {
    return html`${until(this.createSvg())}`;
  }

  private async createSvg(): Promise<SVGSVGElement> {
    const blocks = new Blociau(this.codeBlockHeight, this.styles, this.padding);

    const img = await this.loadImage(this.imgSrc);
    console.log(img.height, img.width);
    const svg = blocks.create(this.id, img);

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
    'blociau-svg': BlociauSVG;
  }
}