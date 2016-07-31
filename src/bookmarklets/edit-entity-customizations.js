try {
    var entityName = formContext.Xrm.Page.data.entity.getEntityName(),
        entityTypeCode;

    if (!entityName) {
        return alert('Could not locate current record\'s logical name. Failed to launch the editor.');
    }

    if (formContext.Mscrm &&
        formContext.Mscrm.EntityPropUtil &&
        formContext.Mscrm.EntityPropUtil.EntityTypeName2CodeMap &&
        formContext.Mscrm.EntityPropUtil.EntityTypeName2CodeMap[entityName] != null) {
        entityTypeCode = formContext.Mscrm.EntityPropUtil.EntityTypeName2CodeMap[entityName];
    }
    else {
        entityTypeCode = parseInt(window.prompt('Could not locate the current record\'s type code. Please enter a value instead if known:'), 10);

        if (isNaN(entityTypeCode)) {
            return;
        }
    }

    if (formContext.Mscrm &&
        formContext.Mscrm.RibbonActions &&
        formContext.Mscrm.RibbonActions.openEntityEditor != null ) {
        alert('About to open ' + entityName + ' in the *default solution*. Please make sure to make your edits inside an actual solution with an appropriate publisher.')
        formContext.Mscrm.RibbonActions.openEntityEditor(entityTypeCode);
    }
    else {
        return alert('Failed to locate internal function for opening customization editor. Please email gotdibbs.');
    }
}
catch(er) {
    alert('Error occurred while attempting to launch the entity editor. '+ er.message);
}