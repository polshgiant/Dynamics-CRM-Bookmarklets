try { 
    var etc = Xrm.Page.context.getQueryStringParameters().etc; 
    xrmWin.Mscrm.RibbonActions.openEntityEditor(etc);
} 
catch(e) {} 