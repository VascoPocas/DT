import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { AppComponentService } from './app.component.service';
import { IDados } from './dados';
import { IDadosERP } from './dadosERP';
import { IDadosLote } from './dadosLote';
import { IDadosLoteDB } from './IDadosLotesDB';

@ViewChild('rendererCanvas', {static: true})
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  reposta: IDados[] = [];
  dados: IDadosERP[] = [];
  lotes: IDadosLote[] =[];
  lotesDB : IDadosLoteDB[] = [];
  async ngOnInit(): Promise<void> {

    
    const service =  new AppComponentService(this.http);

      service.dataERP().subscribe({
        next : dadosERP => {
          this.dados = dadosERP;
          service.dataBaseData().subscribe({
            next : dados => {
             
            this.reposta = dados;

            service.dataERPLote().subscribe({
              next: dadoslote => {
                this.lotes = dadoslote;

                service.dataERPDBLote().subscribe({
                  next : dadosdblote => {
                    this.lotesDB = dadosdblote;
                    service.startAll(this.reposta, this.dados,this.lotes,this.lotesDB);

                  }
                })
                
              }
            })
            
       
          }
        })

        }
      })


     
  }
  title = 'DTInteraction';

  constructor(private http : HttpClient){

  } 


 


}