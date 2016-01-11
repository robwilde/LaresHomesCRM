// creating namespace
var lhc = lhc || {};
lhc.models = lhc.models || {};

// clients entry 
lhc.models.client = function () {
    this.Id = undefined;
    this.LinkTitle = undefined;
    this.ClientsFirstName = undefined;
    this.ClientsLastName = undefined;
    this.ClientsPhone = undefined;
    this.ClientsEmail = undefined;
    this.ClientsAddress = undefined;
    this.ClientsSuburb = undefined;
    this.ClientsCity = undefined;
    this.ClientsPostcode = undefined;
    this.ClientsProjectStatus = undefined;
    this.ClientsNotes = undefined;
    this.ClientsState = undefined;
    this.__metadata = {
        type: 'SP.Data.ClientsListItem'
    };
};