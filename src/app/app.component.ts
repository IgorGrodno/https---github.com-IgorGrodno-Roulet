import { Component, inject } from "@angular/core";
import { PrizeService } from "./servises/prizeServise";
import { PrizesFlexComponent } from "./components/prizes-flex/prizes-flex.component";
import { SpinButtonComponent } from "./components/spin-button/spin-button.component";
import { PrizesCodeComponent } from "./components/prizes-code/prizes-code.component";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { prize } from "./interfaces/prize.interface";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    PrizesFlexComponent,
    SpinButtonComponent,
    PrizesCodeComponent,
    FormsModule,
    CommonModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Roulette';

  prizeService: PrizeService = inject(PrizeService);
  prizes!: prize[];
  winnedPrize?: prize = undefined;
  modalOpen = false;
  soundWhileSpinning?: boolean = true;
  private _designType: string = 'horizontal';
  melodiesPaths: string[] = ['melodies/1.mp3', 'melodies/2.mp3', 'melodies/3.mp3', 'melodies/4.mp3',
    'melodies/5.mp3', 'melodies/6.mp3', 'melodies/7.mp3', 'melodies/8.mp3', 'melodies/9.mp3'];
  private audio: HTMLAudioElement | null = null;
  clicable: boolean = true;
  animationSpeed: number = 0;

  ngOnInit() {
    this.prizeService.getPrizes().subscribe(data => {
      this.prizes = data;
    });
  }

  get designType(): string {
    return this._designType;
  }

  set designType(value: string) {
    this._designType = value;
  }



  async spinButtonClick() {
    if (this.clicable) {

      this.clicable = false;

      if (this.winnedPrize?.id) {
        this.prizes = this.prizes.filter(p => p.id !== this.winnedPrize!.id);
      }

      this.winnedPrize = undefined;

      if (this.soundWhileSpinning) {
        this.playRandomMelody();
      }

      const delays = [3000, 2000, 1000].map(base => base + this.getRandomNumber(0, 2000));

      this.animationSpeed = 3;
      await this.delay(delays[0]);

      this.animationSpeed = 2;
      await this.delay(delays[1]);

      this.animationSpeed = 1;
      await this.delay(delays[2]);

      this.animationSpeed = 0;

      const prizeId = this.getPrizeIdUnderLine();
      console.log(prizeId);
      if (prizeId) {
        this.winnedPrize = this.prizes.find(p => p.id == Number(prizeId));
        console.log(this.winnedPrize);
      }


      this.stopMusic();
      this.clicable = true;
    }
  }


  delay(ms: number | undefined) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getPrizeIdUnderLine() {
    if (this._designType === 'horizontal') {
      const percentageX = 49; // 50% от ширины окна
      const xInPixels = (window.innerWidth * percentageX) / 100; // Конвертация в пиксели
      const yInPixels = 135; // Вертикальная координата в пикселях


      const centerElement = document.elementFromPoint(xInPixels, yInPixels);


      return (centerElement?.id);
    }
    else {
      const centerElement = document.elementFromPoint(window.innerWidth / 2, 383);
      return (centerElement?.id);
    }
  }

  playRandomMelody() {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
    }

    if (this.melodiesPaths.length === 0) {
      console.warn("Список мелодий пуст, не могу воспроизвести звук.");
      return;
    }
    const randomIndex = Math.floor(Math.random() * this.melodiesPaths.length);
    const selectedMelody = this.melodiesPaths[randomIndex];

    this.melodiesPaths.splice(randomIndex, 1);

    this.audio = new Audio(selectedMelody);
    this.audio.loop = true;
    this.audio.play().catch(error => console.error('Ошибка при воспроизведении:', error));
  }


  stopMusic() {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
    }
  }

  getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}



