import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { EMPTY, catchError, debounceTime, distinctUntilChanged, filter, map, of, switchMap } from 'rxjs';
import { Item, LivrosResultado } from 'src/app/models/interfaces';
import { LivroVolumeInfo } from 'src/app/models/livroVolumeInfo';
import { LivroService } from 'src/app/service/livro.service';

const PAUSA = 300;

@Component({
  selector: 'app-lista-livros',
  templateUrl: './lista-livros.component.html',
  styleUrls: ['./lista-livros.component.css']
})
export class ListaLivrosComponent {

  campoBusca = new FormControl();
  mensagemErro = '';
  livrosResultado: LivrosResultado;

  constructor(
    private livroService: LivroService
  ) { }

  livrosEncontrados$ = this.campoBusca.valueChanges
    .pipe(
      debounceTime(PAUSA),
      filter(value => value.length > 3),
      distinctUntilChanged(),
      switchMap((termo: string) => this.livroService.buscar(termo)),
      map(res => this.livrosResultado = res),
      map(res => res.items ?? []),
      map((data) => this.livrosResultadoParaLivros(data)),
      catchError(() => {
        this.mensagemErro = "Ops, ocorreu um erro, recarregue a pagina."
        return EMPTY;
      }),
    );

  livrosResultadoParaLivros(items: Item[]): LivroVolumeInfo[] {
    return items.map(item => new LivroVolumeInfo(item));
  }

}



