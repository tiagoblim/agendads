import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatDialog } from '@angular/material/dialog';

import { ContatoService } from '../contato.service';
import { Contato } from './contato';
import { ContatoDetalheComponent } from '../contato-detalhe/contato-detalhe.component';

@Component({
  selector: 'app-contato',
  templateUrl: './contato.component.html',
  styleUrls: ['./contato.component.css']
})
export class ContatoComponent implements OnInit {

  formulario: FormGroup;
  contatos: Contato[] = [];
  colunas = ['foto', 'id', 'nome', 'email', 'favorito'];

  constructor(
    private service: ContatoService,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.montarFormulario();
    this.listarContatos();
  }

  listarContatos(): void {
    this.service.list().subscribe( response => {
      this.contatos = response;
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
      let lista = [...this.contatos, response];
      this.contatos = lista;
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

}
