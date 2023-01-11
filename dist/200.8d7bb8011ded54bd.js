"use strict";(self.webpackChunkopentele_client_html_angular=self.webpackChunkopentele_client_html_angular||[]).push([[200],{4546:(M,_,s)=>{s.d(_,{O:()=>n});var t=s(60),d=s(4466),l=s(5e3);let n=(()=>{class c{}return c.\u0275fac=function(f){return new(f||c)},c.\u0275mod=l.oAB({type:c}),c.\u0275inj=l.cJS({imports:[t.ez,d.m]}),c})()},8507:(M,_,s)=>{s.d(_,{G:()=>L});var t=s(5e3),d=s(619),l=s(1786),n=s(7362),c=s(4338),p=s(8351),f=s(4879),m=s(60);const C=function(a){return{clickable:a}};function v(a,i){if(1&a){const e=t.EpF();t.TgZ(0,"div",2)(1,"img",3),t.NdJ("click",function(){t.CHM(e);const r=t.oxw();return t.KtG(r.clickLogo())}),t.ALo(2,"translate"),t.qZA()()}if(2&a){const e=t.oxw();t.xp6(1),t.s9C("alt",t.lcZ(2,2,"LOGO_ARIA")),t.Q6J("ngClass",t.VKq(4,C,e.canClickLogo()))}}function O(a,i){if(1&a){const e=t.EpF();t.TgZ(0,"button",13),t.NdJ("click",function(){t.CHM(e);const r=t.oxw(2);return t.KtG(r.goBack())}),t._UZ(1,"i",14),t.qZA()}}function A(a,i){if(1&a){const e=t.EpF();t.TgZ(0,"button",15),t.NdJ("click",function(){t.CHM(e);const r=t.oxw(2);return t.KtG(r.goChangePassword())}),t._UZ(1,"i",16),t.qZA()}}function T(a,i){if(1&a){const e=t.EpF();t.TgZ(0,"button",17),t.NdJ("click",function(){t.CHM(e);const r=t.oxw(2);return t.KtG(r.goHome())}),t._UZ(1,"i",18),t.qZA()}}function E(a,i){if(1&a){const e=t.EpF();t.TgZ(0,"button",19),t.NdJ("click",function(){t.CHM(e);const r=t.oxw(2);return t.KtG(r.goLogout())}),t._UZ(1,"i",20),t.qZA()}}function I(a,i){if(1&a&&(t.TgZ(0,"nav",4)(1,"div",5),t.YNc(2,O,2,0,"button",6),t.YNc(3,A,2,0,"button",7),t.qZA(),t.TgZ(4,"div",8),t._UZ(5,"h1",9),t.qZA(),t.TgZ(6,"div",10),t.YNc(7,T,2,0,"button",11),t.YNc(8,E,2,0,"button",12),t.qZA()()),2&a){const e=t.oxw();t.xp6(2),t.Q6J("ngIf",e.showBackBtn),t.xp6(1),t.Q6J("ngIf",e.showChangePasswordBtn),t.xp6(2),t.Q6J("innerHtml",e.title,t.oJD),t.xp6(2),t.Q6J("ngIf",e.showHomeBtn),t.xp6(1),t.Q6J("ngIf",e.showLogoutBtn)}}let L=(()=>{class a{constructor(e,o,r,u,g,h,x){this.applicationRef=e,this.router=o,this.translate=r,this.native=u,this.appContext=g,this.config=h,this.authentication=x,this.showBackBtn=!1,this.showHomeBtn=!1,this.onHomeFun=()=>this.router.navigate(["/menu"]),this.isClinician=!1,this.title="",this.showChangePasswordBtn=!1,this.showLogoutBtn=!1,this.showLogo=!1,this.goBack=()=>{this.onBackFun?this.onBackFun():globalThis.history.back()},this.goLogout=()=>{const B=this.translate.instant("LOGOUT_CONFIRM_MSG"),D=this.translate.instant("OK"),b=this.translate.instant("CANCEL");this.native.showConfirmDialog(B,D,b,S=>{S&&(this.router.navigate(["/logout"]),setTimeout(()=>this.applicationRef.tick(),100))})},this.goChangePassword=()=>{this.router.navigate(["/change_password"])}}ngOnChanges(){this.title=this.title?this.translate.instant(this.title):""}canClickLogo(){return!!this.helpAndInfoUrl()}helpAndInfoUrl(){return this.config.getAppConfig().helpAndInfoUrl}clickLogo(){const e=this.helpAndInfoUrl();this.canClickLogo()&&void 0!==e&&this.native.openUrl(e)}goHome(){this.onHomeFun?this.onHomeFun():this.router.navigate(["/menu"])}goClinicianMenu(){this.appContext.requestParams.getAndClear("selectedPatient"),this.router.navigate(["/clinician_menu"])}}return a.\u0275fac=function(e){return new(e||a)(t.Y36(t.z2F),t.Y36(d.F0),t.Y36(l.sK),t.Y36(n.R),t.Y36(c.P),t.Y36(p.E),t.Y36(f.$))},a.\u0275cmp=t.Xpm({type:a,selectors:[["header-menu"]],inputs:{showBackBtn:"showBackBtn",onBackFun:"onBackFun",showHomeBtn:"showHomeBtn",onHomeFun:"onHomeFun",isClinician:"isClinician",title:"title",showChangePasswordBtn:"showChangePasswordBtn",showLogoutBtn:"showLogoutBtn",showLogo:"showLogo"},features:[t.TTD],decls:2,vars:2,consts:[["id","logo",4,"ngIf"],["id","header",4,"ngIf"],["id","logo"],["src","./assets/product-flavor/images/header.svg",3,"alt","ngClass","click"],["id","header"],[1,"header-left"],["id","back-button","type","button","class","button",3,"click",4,"ngIf"],["id","change-password-button","type","button","class","button",3,"click",4,"ngIf"],[1,"header-center"],["id","header-title",3,"innerHtml"],[1,"header-right"],["id","menu-button","type","button","class","button",3,"click",4,"ngIf"],["id","logout-button","type","button","class","button",3,"click",4,"ngIf"],["id","back-button","type","button",1,"button",3,"click"],["aria-hidden","true",1,"fal","fa-arrow-left"],["id","change-password-button","type","button",1,"button",3,"click"],["aria-hidden","true",1,"fal","fa-user-lock"],["id","menu-button","type","button",1,"button",3,"click"],["aria-hidden","true",1,"fal","fa-home"],["id","logout-button","type","button",1,"button",3,"click"],["aria-hidden","true",1,"fal","fa-sign-out"]],template:function(e,o){1&e&&(t.YNc(0,v,3,6,"div",0),t.YNc(1,I,9,5,"nav",1)),2&e&&(t.Q6J("ngIf",o.showLogo),t.xp6(1),t.Q6J("ngIf",!o.showLogo))},dependencies:[m.mk,m.O5,l.X$]}),a})()},200:(M,_,s)=>{s.r(_),s.d(_,{OidcStartLoginModule:()=>a});var t=s(60),d=s(619),l=s(4815),n=s(5e3),c=s(5066),p=s(4865),f=s(4879),m=s(1786),C=s(8507);function v(i,e){if(1&i&&(n.TgZ(0,"div",9),n._UZ(1,"i",10),n.TgZ(2,"span"),n._uU(3),n.ALo(4,"translate"),n.qZA()()),2&i){const o=n.oxw();n.xp6(3),n.AsE("",n.lcZ(4,2,o.errorMessage)," ",o.errorDescription,"")}}function O(i,e){if(1&i){const o=n.EpF();n.TgZ(0,"input",11),n.NdJ("click",function(){n.CHM(o);const u=n.oxw();return n.KtG(u.sendOIDCAuthRequest())}),n.ALo(1,"translate"),n.qZA()}2&i&&n.s9C("value",n.lcZ(1,1,"OIDC_SIGN_IN_TEXT"))}const T=[{path:"",component:(()=>{class i{constructor(o,r,u,g,h,x){this.oidcUtils=o,this.userSession=r,this.authentication=u,this.router=g,this.translate=h,this.oidcService=x,this.errorMessage="",this.oidcSignIn=!1,this.infoText="",this.errorDescription=""}sendOIDCAuthRequest(){this.oidcUtils.sendAuthRequest()}setInitialState(){this.authentication.setCanChangePassword(!1),l.eC.delete(),this.errorMessage="",this.oidcSignIn=!1,this.infoText=this.translate.instant("OIDC_INFO_TEXT")}pinCodeRequired(o){return o&&"PINCODE_REQUIRED"===o.code}startLogin(o){this.userSession.startSilentLogin(o,u=>{const g=u.status,h=u.data;switch(g){case-1:case 401:if(this.pinCodeRequired(h))return console.info("Need PIN-code login"),void this.router.navigate(["/pincode_login"]);l.eC.set(o),console.debug(`Setting root: ${JSON.stringify(o)}`),console.info("Unable to login using refresh token. OIDC login needed."),this.oidcSignIn=!0,this.oidcService.runOIDC();break;default:console.error(`Silent login failed with unexpected error: ${g} `+JSON.stringify(h,null,4)),this.errorMessage="OPENTELE_DOWN_TEXT"}})}connectionError(){this.errorMessage="OPENTELE_UNAVAILABLE_TEXT"}checkForErrors(){const o=this.oidcUtils.parseQueryString();if("error"in o)return this.errorMessage="OIDC_LOGIN_FAILED",console.error("Error from OIDC provider: "+o.error),"error_description"in o&&(this.errorDescription=o.error_description,console.error("Description: "+o.error_description)),void(this.oidcSignIn=!0)}ngOnInit(){this.setInitialState(),this.userSession.init().then(o=>{this.startLogin(o)}).catch(o=>{console.error(o),this.connectionError()})}}return i.\u0275fac=function(o){return new(o||i)(n.Y36(c.T),n.Y36(p.o),n.Y36(f.$),n.Y36(d.F0),n.Y36(m.sK),n.Y36(c.T))},i.\u0275cmp=n.Xpm({type:i,selectors:[["app-oidc-start-login"]],decls:11,vars:6,consts:[[1,"container"],[3,"showLogo"],[1,"content","space_between"],["id","info-box-container"],["id","disclaimer-text"],["class","notification error",4,"ngIf"],[1,"fill"],["id","input-container"],["id","oidc-sign-in","type","submit","class","list_item confirm-btn",3,"value","click",4,"ngIf"],[1,"notification","error"],[1,"notification_icon","fas","fa-exclamation-triangle"],["id","oidc-sign-in","type","submit",1,"list_item","confirm-btn",3,"value","click"]],template:function(o,r){1&o&&(n.TgZ(0,"div",0),n._UZ(1,"header-menu",1),n.TgZ(2,"div",2)(3,"div",3)(4,"div",4),n._uU(5),n.ALo(6,"translate"),n.qZA()(),n.YNc(7,v,5,4,"div",5),n.TgZ(8,"div",6)(9,"div",7),n.YNc(10,O,2,3,"input",8),n.qZA()()()()),2&o&&(n.xp6(1),n.Q6J("showLogo",!0),n.xp6(4),n.hij(" ",n.lcZ(6,4,"OIDC_INFO_TEXT")," "),n.xp6(2),n.Q6J("ngIf",r.errorMessage),n.xp6(3),n.Q6J("ngIf",r.oidcSignIn))},dependencies:[t.O5,C.G,m.X$]}),i})()}];let E=(()=>{class i{}return i.\u0275fac=function(o){return new(o||i)},i.\u0275mod=n.oAB({type:i}),i.\u0275inj=n.cJS({imports:[d.Bz.forChild(T),d.Bz]}),i})();var I=s(4466),L=s(4546);let a=(()=>{class i{}return i.\u0275fac=function(o){return new(o||i)},i.\u0275mod=n.oAB({type:i}),i.\u0275inj=n.cJS({imports:[t.ez,E,I.m,L.O]}),i})()}}]);