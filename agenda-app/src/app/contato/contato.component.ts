import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatDialog } from '@angular/material/dialog';

import { ContatoService } from '../contato.service';
import { Contato } from './contato';
import { ContatoDetalheComponent } from '../contato-detalhe/contato-detalhe.component';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-contato',
  templateUrl: './contato.component.html',
  styleUrls: ['./contato.component.css']
})
export class ContatoComponent implements OnInit {

  formulario: FormGroup;
  contatos: Contato[] = [];
  colunas = ['foto', 'id', 'nome', 'email', 'favorito'];

  totalElements = 0;
  pagina = 0;
  tamanho = 10;
  pageSizeOptions = [10];

  constructor(
    private service: ContatoService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.montarFormulario();
    this.listarContatos(this.pagina, this.tamanho);
  }

  listarContatos(pagina = 0, tamanhoPagina = 10): void {
    this.service.list(pagina, tamanhoPagina).subscribe( response => {
      this.contatos = response.content;
      this.totalElements = response.totalElements;
      this.pagina = response.number;
    });
  }

  montarFormulario(): void {
    this.formulario = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  favoritar(contato: Contato): void {
    this.service.favorite(contato).subscribe(response => {
      contato.favorito = !contato.favorito;
    });
  }

  submit(): void {    
    const formValues = this.formulario.value;
    const contato = new Contato(formValues.nome, formValues.email);

    this.service.save(contato).subscribe( response => {
      this.listarContatos();
      this.formulario.reset();
      this.snackBar.open('O contat foi adicionado com sucesso', 'Sucesso', {
        duration: 2000
      });
    })
  }

  uploadFoto(event, contato: Contato): void {
    const files = event.target.files;
    if (files) {
      const foto = files[0];
      const formData = new FormData();
      formData.append("foto", foto);
      this.service.upload(contato, formData)
        .subscribe(response => this.listarContatos());
    }
  }

  visualizarContato(contato: Contato): void {
    this.dialog.open(ContatoDetalheComponent, {
      width: '400px',
      height: '450px',
      data: contato
    })
  }

  paginar(event: PageEvent) {
    this.pagina = event.pageIndex;
    this.listarContatos(this.pagina, this.tamanho);
  }

}
