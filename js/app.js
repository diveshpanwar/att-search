const chip = `
<div class="chip">
%chipName%
<i class="close material-icons">close</i>
</div>
`;

$(document).ready(function() {
  var selectedTagValue = null;
  var chipId = 0;
  var selectedChipId = null;
  var setChip = false;
  function onModalCloseEndCallback() {
    if (setChip) {
      let chip = document.getElementById(`${sessionStorage.getItem('chipId')}`);
      let chipOuterHTML = chip.outerHTML;
      let newOuterHTML = null;
      switch (selectedTagValue) {
        case 'en':
          newOuterHTML = chipOuterHTML
            .replace('data-kw="keyword"', 'data-en="entity"')
            .replace('data-in="intent"', 'data-en="entity"');
          break;
        case 'in':
          newOuterHTML = chipOuterHTML
            .replace('data-kw="keyword"', 'data-in="intent"')
            .replace('data-en="entity"', 'data-in="intent"');
          break;
        case 'kw':
          newOuterHTML = chipOuterHTML
            .replace('data-in="intent"', 'data-kw="keyword"')
            .replace('data-en="entity"', 'data-kw="keyword"');
          break;
      }
      chip.outerHTML = newOuterHTML;
      setChip = false;
    }
  }

  $('.modal').modal({
    onCloseEnd: onModalCloseEndCallback
  });

  function chipAddCallback() {
    let orgHTML = this.$chips[this.chipsData.length - 1].outerHTML;
    let chipCreated = this.chipsData[this.chipsData.length - 1].tag;
    let newHTML = orgHTML.replace(
      'div class="chip"',
      `div href="#modal1" data-kw="keyword" id="chip-${chipId}" class="chip waves-effect waves-light modal-trigger"`
    );
    this.$chips[this.chipsData.length - 1].outerHTML = newHTML;
    chipId++;
  }
  function chipDeleteCallback() {
    console.log('Chip Deleted!');
  }
  function chipSelectCallback() {
    selectedTagValue = null;
    window.selectedChipId = this._selectedChip[0].id;
  }

  function init() {
    $('.chips').chips({
      placeholder: 'Enter a Keyword',
      secondaryPlaceholder: '+ Keyword',
      onChipAdd: chipAddCallback,
      onChipDelete: chipDeleteCallback,
      onChipSelect: chipSelectCallback,
      autocompleteOptions: {
        data: {
          termination: null
        },
        limit: Infinity,
        minLength: 1
      }
    });
  }
  $(init);
  $('select').formSelect();

  $('#setTagAction').click(function() {
    selectedTagValue = $('#tagElementType')
      .children('option:selected')
      .val();

    var modalElem = $('#modal1');
    var modalInstance = M.Modal.getInstance(modalElem);
    setChip = true;
    modalInstance.close();
  });

  $(document).click(function(e) {
    if (e.target.id.indexOf('chip-') !== -1) {
      sessionStorage.setItem('chipId', e.target.id);
    }
  });
});
