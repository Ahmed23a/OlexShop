
const socketEvents = {
    updateSocketID: 'updateSocketID',
    addProduct: 'addProduct',
    addComment: 'addComment',
    addReply: 'addReply',
    updateComment: 'updateComment'
  }


const clintIo = io("http://localhost:3000")

clintIo.emit(socketEvents.updateSocketID, '62ce6bf3bd14ac6906d14136')





$('#addNote').click(function () {
    const assignObj = {
     title: $('#title').val(),
      desc: $('#desc').val(),
      price: $('#price').val()
    }
    console.log({ assignObj: assignObj })
    clintIo.emit(socketEvents.addProduct, assignObj)
    
  })

  clintIo.on(socketEvents.addProduct, data => {
    displayData(data)
  })
  
  function displayData (data) {
    console.log({data})
    let hasala = ''
    for (let i = 0; i < data.length; i++) {
      hasala += `
                <div class="col-md-4 my-2">
                <div class="p-2">
                    <div class="card text-center" style="width: 18rem;">
                        <div class="card-body">
                            <h5 class="card-title">${data[i].title}</h5>
                            <p class="card-text">${data[i].description}</p>
                            <p class="card-text">${data[i].price}</p>
  
                        </div>
                    </div>
                </div>
            </div>  
                `
    }
    $('.rowData').html(hasala)
  }

function displayData2(data) {
    console.log(data);
        let hasala = '';
        for (let i = 0; i < data.length; i++) {
            hasala += `
                  <div class="col-md-4 my-2">
                  <div class="p-2">
                      <div class="card text-center" style="width: 18rem;">
                          <div class="card-body">
                              <h5 class="card-title">${data[i].body}</h5>
                              <p class="card-text">${data[i].commentedBy}</p>                              
                          </div>
                      </div>
                  </div>
              </div>
                  
                  `
         
    
        }
        $(".rowData2").html(hasala)
    }