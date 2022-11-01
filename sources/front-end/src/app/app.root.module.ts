import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppRootComponent } from './app.root.component';
import { PlaceholderComponent } from './components/placeholder/placeholder.component';
import { MainScreenLayoutComponent } from './containers/main-screen-layout/main-screen-layout.component';
import { DiagramButtonsComponent } from './components/diagram-buttons/diagram-buttons.component';
import { TreeViewComponent } from './components/tree-view2/tree-view2.component';
import { OcdPsdModelerComponent } from './components/modelers/ocd-psd-modeler/ocd-psd-modeler.component';
import { AmdModelerComponent } from './components/modelers/amd-modeler/amd-modeler.component';
import { OfdModelerComponent } from './components/modelers/ofd-modeler/ofd-modeler.component';
import { PsdModelerComponent } from './components/modelers/psd-modeler/psd-modeler.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatTreeModule, MatToolbarModule, MatSidenavModule, MatIconModule, MatListModule, MatMenuModule, MatCheckboxModule, MatFormFieldModule, MatInputModule, MatOptionModule, MatSelectModule, MatRadioModule, MatSnackBar, MatSnackBarModule } from '@angular/material';
import { LayoutModule } from '@angular/cdk/layout';
import { EditorLayoutComponent } from './containers/editor-layout/editor-layout.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { reducers } from './services/state-management/reducers/';
import { NgModel, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CanvasComponent } from './containers/canvas/canvas.component';
import { PsiContractEditorEffects } from './services/state-management/effects';
import { EffectsModule } from '@ngrx/effects';
import { ConnectionStatusComponent } from './components/connection-status/connection-status.component';
import { ErrorNotificationComponent } from './components/error-notification/error-notification.component';
import { TreeViewNodeComponent } from './components/tree-view-node/tree-view-node.component';

@NgModule({
	declarations: [
		AppRootComponent,
		PlaceholderComponent,
		MainScreenLayoutComponent,
		DiagramButtonsComponent,
		TreeViewComponent,
		CanvasComponent,
		OcdPsdModelerComponent,
		AmdModelerComponent,
		OfdModelerComponent,
		OcdPsdModelerComponent,
		PsdModelerComponent,
		EditorLayoutComponent,
		ConnectionStatusComponent,
		ErrorNotificationComponent,
		TreeViewNodeComponent
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		MatTooltipModule,
		AppRoutingModule,
		MatButtonModule,
		LayoutModule,
		MatToolbarModule,
		MatSidenavModule,
		MatIconModule,
		MatListModule,
		MatMenuModule,
		MatCheckboxModule,
		MatTreeModule,
		MatFormFieldModule,
		MatInputModule,
		MatOptionModule,
		MatSelectModule,
		MatRadioModule,
		FormsModule,
		MatSnackBarModule,
		ReactiveFormsModule,
		StoreModule.forRoot(reducers),
		EffectsModule.forRoot([PsiContractEditorEffects]),
		StoreDevtoolsModule.instrument({
			maxAge: 10,
			serialize: true
		})
	],
	providers: [MatSnackBar],
	bootstrap: [AppRootComponent],
	entryComponents: [ErrorNotificationComponent]
})
export class AppModule { }
