import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Card } from 'src/app/models/card.model';
import { columns } from 'src/app/models/columns';
import { APIService } from 'src/app/services/api.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
})
export class CardComponent implements OnInit {
  @Input() column!: string;
  @Input() card!: Card;
  @Output() cardChanged = new EventEmitter<Card[]>();

  cols = columns;
  atFirstColumn?: boolean;
  atLastColumn?: boolean;

  id: string = '';
  titulo: string = '';
  conteudo: string = '';
  lista: string = '';

  editMode: boolean = false;

  constructor(private api: APIService) {}

  ngOnInit(): void {
    this.getCardInfo();
  }

  getCardInfo() {
    this.atFirstColumn = this.cols.indexOf(this.card.lista) == 0;
    this.atLastColumn =
      this.cols.indexOf(this.card.lista) == this.cols.length - 1;

    this.id = this.card.id;
    this.titulo = this.card.titulo;
    this.conteudo = this.card.conteudo;
    this.lista = this.card.lista;

    if (!this.id) {
      this.toggleEditMode();
    }
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
  }

  moveCardLeft() {
    if (this.atFirstColumn) {
      return;
    }
    const index = this.cols.indexOf(this.card.lista);
    this.card.lista = this.cols[index - 1];
    this.api
      .changeCardById(
        this.card.id,
        this.titulo,
        this.conteudo,
        this.card.lista
      )
      .subscribe((card) => {
        this.api.cardsChanged.next(card);
      });
  }

  moveCardRight() {
    if (this.atLastColumn) {
      return;
    }
    const index = this.cols.indexOf(this.card.lista);
    this.card.lista = this.cols[index + 1];
    this.api
      .changeCardById(
        this.card.id,
        this.titulo,
        this.conteudo,
        this.card.lista
      )
      .subscribe((card) => {
        this.api.cardsChanged.next(card);
      });
  }

  saveCard() {
    if (this.card.id) {
      this.api
        .changeCardById(this.card.id, this.titulo, this.conteudo, this.lista)
        .subscribe((card) => {
          // this.card = card;
        });
    } else {
      this.api
        .createNewCard(this.titulo, this.conteudo, this.lista)
        .subscribe((card) => {
          this.api.cardsChanged.next(card);
        });
    }
    this.toggleEditMode();
  }

  cancelEdit() {
    this.titulo = this.card.titulo;
    this.conteudo = this.card.conteudo;
    this.lista = this.card.lista;
    this.toggleEditMode();
  }

  deleteCard() {
    this.api.deleteCardById(this.card.id).subscribe((card) => {
      this.api.cardsChanged.next(card);
    });
  }


  
    getBackgroundColor() {
      switch (this.lista) {
       
        case "ToDo": {
          return "rgb(255, 240, 240)";
  
        }
  
        case "Doing": {
          return "rgb(255, 255, 240)";
        }
  
        case "Done": {
          return "rgb(240, 255, 255)";
        }
  
        default: {
          return "white";
        }
      }
    }
  
}
