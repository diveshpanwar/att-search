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
            .replace('data-in="intent"', 'data-en="entity"')
            .replace('data-ke="keyword entity"', 'data-en="entity"')
            .replace('data-ki="keyword intent"', 'data-en="entity"')
            .replace('data-ei="entity intent"', 'data-en="entity"')
            .replace('data-kei="keyword entity intent"', 'data-en="entity"');
          break;
        case 'in':
          newOuterHTML = chipOuterHTML
            .replace('data-kw="keyword"', 'data-in="intent"')
            .replace('data-en="entity"', 'data-in="intent"')
            .replace('data-ke="keyword entity"', 'data-in="intent"')
            .replace('data-ki="keyword intent"', 'data-in="intent"')
            .replace('data-ei="entity intent"', 'data-in="intent"')
            .replace('data-kei="keyword entity intent"', 'data-in="intent"');
          break;
        case 'kw':
          newOuterHTML = chipOuterHTML
            .replace('data-en="entity"', 'data-kw="keyword"')
            .replace('data-in="intent"', 'data-kw="keyword"')
            .replace('data-ke="keyword entity"', 'data-kw="keyword"')
            .replace('data-ki="keyword intent"', 'data-kw="keyword"')
            .replace('data-ei="entity intent"', 'data-kw="keyword"')
            .replace('data-kei="keyword entity intent"', 'data-kw="keyword"');
          break;
        case 'ki':
          newOuterHTML = chipOuterHTML
            .replace('data-kw="keyword"', 'data-ki="keyword intent"')
            .replace('data-in="intent"', 'data-ki="keyword intent"')
            .replace('data-ke="keyword entity"', 'data-ki="keyword intent"')
            .replace('data-en="entity"', 'data-ki="keyword intent"')
            .replace('data-ei="entity intent"', 'data-ki="keyword intent"')
            .replace(
              'data-kei="keyword entity intent"',
              'data-ki="keyword intent"'
            );
          break;
        case 'ke':
          newOuterHTML = chipOuterHTML
            .replace('data-kw="keyword"', 'data-ke="keyword entity"')
            .replace('data-in="intent"', 'data-ke="keyword entity"')
            .replace('data-en="entity"', 'data-ke="keyword entity"')
            .replace('data-ki="keyword intent"', 'data-ke="keyword entity"')
            .replace('data-ei="entity intent"', 'data-ke="keyword entity"')
            .replace(
              'data-kei="keyword entity intent"',
              'data-ke="keyword entity"'
            );
          break;
        case 'ei':
          newOuterHTML = chipOuterHTML
            .replace('data-kw="keyword"', 'data-ei="entity intent"')
            .replace('data-in="intent"', 'data-ei="entity intent"')
            .replace('data-ke="keyword entity"', 'data-ei="entity intent"')
            .replace('data-ki="keyword intent"', 'data-ei="entity intent"')
            .replace('data-en="entity"', 'data-ei="entity intent"')
            .replace(
              'data-kei="keyword entity intent"',
              'data-ei="entity intent"'
            );
          break;
        case 'kei':
          newOuterHTML = chipOuterHTML
            .replace('data-kw="keyword"', 'data-kei="keyword entity intent"')
            .replace('data-in="intent"', 'data-kei="keyword entity intent"')
            .replace(
              'data-ke="keyword entity"',
              'data-kei="keyword entity intent"'
            )
            .replace(
              'data-ki="keyword intent"',
              'data-kei="keyword entity intent"'
            )
            .replace(
              'data-ei="entity intent"',
              'data-kei="keyword entity intent"'
            )
            .replace('data-en="entity"', 'data-kei="keyword entity intent"');
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
  function chipDeleteCallback(e) {
    console.log('Chip Deleted!', e);
    // e.preventDefault();
    // e.stopPropagation();
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
    selectedTagValue = null;
    let valuesSelected = $('#tagElementType').val();
    if (valuesSelected.length == 2) {
      selectedTagValue = valuesSelected[0][0] + valuesSelected[1][0];
    } else if (valuesSelected.length == 1) {
      selectedTagValue = valuesSelected[0];
    } else if (valuesSelected.length == 3) {
      selectedTagValue = 'kei';
    }
    var modalElem = $('#modal1');
    var modalInstance = M.Modal.getInstance(modalElem);
    setChip = true;
    modalInstance.close();
  });

  $(document).click(function(e) {
    if (e.target.id.indexOf('chip-') !== -1) {
      sessionStorage.setItem('chipId', e.target.id);
      if (e.target.outerHTML.indexOf('data-kei') !== -1) {
        $('#tagElementType').val(['kw', 'en', 'in']);
      } else if (e.target.outerHTML.indexOf('data-kw') !== -1) {
        $('#tagElementType').val(['kw']);
      } else if (e.target.outerHTML.indexOf('data-en') !== -1) {
        $('#tagElementType').val(['en']);
      } else if (e.target.outerHTML.indexOf('data-in') !== -1) {
        $('#tagElementType').val(['in']);
      } else if (e.target.outerHTML.indexOf('data-ke') !== -1) {
        $('#tagElementType').val(['kw', 'en']);
      } else if (e.target.outerHTML.indexOf('data-ki') !== -1) {
        $('#tagElementType').val(['kw', 'in']);
      } else if (e.target.outerHTML.indexOf('data-ei') !== -1) {
        $('#tagElementType').val(['en', 'in']);
      }
      $('#tagElementType').formSelect();
    }
  });

  $('#searchIcon').click(function() {
    console.log('I am clicked');
    let searchCriteria = {
      intents: [],
      entities: [],
      keywords: []
    };
    let chips = $('#tagChips');
    let chipChildren = chips.children();
    for (let i = 0; i < chipChildren.length; i++) {
      const element = chipChildren[i];
      const elemText = element.innerText.slice(0, element.innerText.length - 6);
      if (element.id.indexOf('chip') !== -1) {
        if (element.outerHTML.indexOf('data-kei') !== -1) {
          searchCriteria.keywords.push(elemText);
          searchCriteria.entities.push(elemText);
          searchCriteria.intents.push(elemText);
        } else if (element.outerHTML.indexOf('data-kw') !== -1) {
          searchCriteria.keywords.push(elemText);
        } else if (element.outerHTML.indexOf('data-en') !== -1) {
          searchCriteria.entities.push(elemText);
        } else if (element.outerHTML.indexOf('data-in') !== -1) {
          searchCriteria.intents.push(elemText);
        } else if (element.outerHTML.indexOf('data-ki') !== -1) {
          searchCriteria.keywords.push(elemText);
          searchCriteria.intents.push(elemText);
        } else if (element.outerHTML.indexOf('data-ke') !== -1) {
          searchCriteria.keywords.push(elemText);
          searchCriteria.entities.push(elemText);
        } else if (element.outerHTML.indexOf('data-ei') !== -1) {
          searchCriteria.entities.push(elemText);
          searchCriteria.intents.push(elemText);
        }
      }
    }
    console.log(searchCriteria);
  });
});
