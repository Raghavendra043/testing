"use strict";(self.webpackChunkopentele_client_html_angular=self.webpackChunkopentele_client_html_angular||[]).push([[4],{5004:(S,u,i)=>{i.r(u),i.d(u,{PinCodeLoginModule:()=>E});var g=i(60),d=i(619),f=i(4815),o=i(5e3),h=i(4338),p=i(7362),C=i(4865),m=i(1786),L=i(4879),a=i(3075),v=i(8507);function T(n,r){if(1&n&&(o.TgZ(0,"div",16),o._UZ(1,"i",17),o.TgZ(2,"span"),o._uU(3),o.ALo(4,"translate"),o.qZA()()),2&n){const e=o.oxw();o.xp6(3),o.Oqu(o.lcZ(4,1,e.model.error))}}function P(n,r){1&n&&o._UZ(0,"i",18)}const O=[{path:"",component:(()=>{class n{constructor(e,t,s,l,c,I){this.appContext=e,this.router=t,this.native=s,this.userSession=l,this.translate=c,this.authentication=I,this.model={state:"Initial"},this.loaded=()=>!!this.root,this.userSession.init().then(M=>this.root=M).catch(()=>this.model.error="OPENTELE_UNAVAILABLE_TEXT")}forgotPinCode(){const e=this.translate.instant("LOGOUT_CONFIRM_RESET_PINCODE_MSG"),t=this.translate.instant("OK"),s=this.translate.instant("Cancel");this.native.showConfirmDialog(e,t,s,l=>{if(!l)return;const c=this.appContext.currentUser.get();this.authentication.logout(c).subscribe(()=>{f.oE.set(!1),this.router.navigate(["/reset_login"])})})}login(){this.model.state="Loading",this.authentication.pinCodeLogin(this.root.links.auth,this.model.pinCode).then(t=>{if(!("claims"in t))throw t;this.onSuccess(t),this.model.state="Loaded"}).catch(t=>this.onError(t))}onSuccess({claims:e,canChangePassword:t,logoutUrl:s,organizations:l}){this.userSession.completeLogin(this.root,e,t,s,l)}onError(e){this.model.state="Failed";const t=e.status,s=e.data;switch(console.error("PIN-code login failed: "+JSON.stringify(t,null,4)+"\n"+JSON.stringify(s,null,4)),t){case-1:this.router.navigate(["/login"]);break;case 401:this.model.error="BAD_MFA_CREDENTIALS"===s.code?"PINCODE_BAD_CREDENTIALS":"ACCOUNT_LOCKED"}}}return n.\u0275fac=function(e){return new(e||n)(o.Y36(h.P),o.Y36(d.F0),o.Y36(p.R),o.Y36(C.o),o.Y36(m.sK),o.Y36(L.$))},n.\u0275cmp=o.Xpm({type:n,selectors:[["app-pin-code-login"]],decls:21,vars:14,consts:[[1,"container"],[3,"showLogo"],[1,"content","space_between"],["class","notification error",4,"ngIf"],[1,"fill"],["id","pin-code-form","autocomplete","off","autocorrect","off","autocapitalize","off",1,"login_form",3,"ngSubmit"],["pinCodeForm","ngForm"],["id","input-container"],[1,"login_input"],[1,"fal","fa-lock-alt"],["id","pincode","required","","type","text","inputmode","numeric","step","1","size","13","autocomplete","off","autocorrect","off","autocapitalize","off","name","pinCode",1,"pincode",3,"placeholder","ngModel","ngModelChange"],[1,"button_container"],["type","submit",3,"disabled"],["class","fa fa-spinner fa-spin",4,"ngIf"],["id","forgot-pincode-container"],["id","forgot-pincode",1,"link",3,"click"],[1,"notification","error"],[1,"notification_icon","fas","fa-exclamation-triangle"],[1,"fa","fa-spinner","fa-spin"]],template:function(e,t){1&e&&(o.TgZ(0,"div",0),o._UZ(1,"header-menu",1),o.TgZ(2,"div",2),o.YNc(3,T,5,3,"div",3),o.TgZ(4,"div",4)(5,"form",5,6),o.NdJ("ngSubmit",function(){return t.login()}),o.TgZ(7,"div",7)(8,"div",8),o._UZ(9,"i",9),o.TgZ(10,"input",10),o.NdJ("ngModelChange",function(l){return t.model.pinCode=l}),o.ALo(11,"translate"),o.qZA()(),o.TgZ(12,"div",11)(13,"button",12),o._uU(14),o.ALo(15,"translate"),o.YNc(16,P,1,0,"i",13),o.qZA()()(),o.TgZ(17,"div",14)(18,"a",15),o.NdJ("click",function(){return t.forgotPinCode()}),o._uU(19),o.ALo(20,"translate"),o.qZA()()()()()()),2&e&&(o.xp6(1),o.Q6J("showLogo",!0),o.xp6(2),o.Q6J("ngIf",t.model.error),o.xp6(7),o.s9C("placeholder",o.lcZ(11,8,"LOGIN_MFA_PINCODE")),o.Q6J("ngModel",t.model.pinCode),o.xp6(3),o.Q6J("disabled",!t.loaded()||"Loading"===t.model.state),o.xp6(1),o.hij(" ","Loading"!==t.model.state?o.lcZ(15,10,"LOGIN_LOGIN_BUTTON"):""," "),o.xp6(2),o.Q6J("ngIf","Loading"===t.model.state),o.xp6(3),o.hij(" ",o.lcZ(20,12,"LOGIN_FORGOT_PINCODE")," "))},dependencies:[g.O5,a._Y,a.Fj,a.JJ,a.JL,a.Q7,a.On,a.F,v.G,m.X$]}),n})()}];let N=(()=>{class n{}return n.\u0275fac=function(e){return new(e||n)},n.\u0275mod=o.oAB({type:n}),n.\u0275inj=o.cJS({imports:[d.Bz.forChild(O),d.Bz]}),n})();var Z=i(4466),A=i(4546);let E=(()=>{class n{}return n.\u0275fac=function(e){return new(e||n)},n.\u0275mod=o.oAB({type:n}),n.\u0275inj=o.cJS({imports:[g.ez,N,a.u5,Z.m,A.O]}),n})()}}]);