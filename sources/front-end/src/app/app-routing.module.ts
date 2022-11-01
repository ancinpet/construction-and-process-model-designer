import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlaceholderComponent } from './components/placeholder/placeholder.component';
import { OcdPsdModelerComponent } from './components/modelers/ocd-psd-modeler/ocd-psd-modeler.component';
import { AmdModelerComponent } from './components/modelers/amd-modeler/amd-modeler.component';
import { OfdModelerComponent } from './components/modelers/ofd-modeler/ofd-modeler.component';
import { PsdModelerComponent } from './components/modelers/psd-modeler/psd-modeler.component';

const routes: Routes = [
	{path: '', component: PlaceholderComponent},
	{path: 'modelerAmd/:id', component: AmdModelerComponent},
	{path: 'OCD', component: OcdPsdModelerComponent},
  {path: 'modelerOfd', component: OfdModelerComponent},
  {path: 'modelerPsd/:id1/:id2', component: PsdModelerComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
