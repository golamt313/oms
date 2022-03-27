window.onload = function () {
  dynamicOrderInfo = document.getElementById("orderInfo");
  dynamicItemsHere = document.getElementById("dynamicItemsHere");
  dynamicHere = document.getElementById("dynamicHere");
  container = document.getElementsByClassName("container")[0];
  tables = document.getElementsByClassName("table")[0];
  cardbody = document.getElementsByClassName("card-body")[0];

  orderForm = document.getElementById("orderForm");
  itemForm = document.getElementById("itemForm");
  orderEditForm = document.getElementById("orderEditForm");

  const getOrders = async() => {
    fetch('http://localhost:8090/orders/getOrders')
    .then(response => response.json())
    .then(json => {
      json.forEach((obj) => {
        UI.displayOrder(new order(obj.date, obj.id, obj.customer, obj.total, obj.status));
      })
    })
  }

  const saveOrder = async() => {
    date = document.getElementById("date").value;
    orderNumber = document.getElementById("orderNumber").value;
    customerName = document.getElementById("customerName").value;
    orderTotal = document.getElementById("orderTotal").value;
    orderStatus = document.getElementById("orderStatus").value;
    if(orderTotal.charAt(0) == '$') {orderTotal = orderTotal.substring(1)}
    if (
      date == "" ||
      orderNumber == "" ||
      customerName == "" ||
      orderTotal == "" ||
      orderStatus == ""
    ) {
      UI.message("Input FIeld Cannot Be Blank", "danger", orderForm);
    } else {
        await fetch('http://localhost:8090/orders/save', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json' 
          },
          body: JSON.stringify({
            "id": parseInt(orderNumber),
            "date": date,
            "customer": customerName,
            "total": orderTotal,
            "status": orderStatus
          })
        })
        UI.displayOrder(
          new order(date, orderNumber, customerName, orderTotal, orderStatus)
        );
        UI.clearField();
        UI.message("Order Added", "success", orderForm);
      };
    } 
    
  $(document).on('click','#deleteOrder',function(e){
    var cells = e.target.parentElement.parentElement.getElementsByTagName("td");
    var orderNumber = cells[1].innerHTML.trim();
    fetch(`${'http://localhost:8090/orders/deleteOrder'}/${orderNumber}`, {
      method: "DELETE"
    })
      .then(() => e.target.parentElement.parentElement.remove())
      .catch(error => console.error("Unable to delete Order.", error));
  })
      
  orderForm.addEventListener("submit", saveOrder);
  getOrders();

  class order {
    constructor(date, orderNumber, customerName, orderTotal, orderStatus) {
      this.date = date;
      this.orderNumber = orderNumber;
      this.customerName = customerName;
      this.orderTotal = orderTotal;
      this.orderStatus = orderStatus;
    }
  }

  class product {
    constructor(itemNumber, item, quantity, price, desc, productStatus) {
      this.itemNumber = itemNumber;
      this.item = item;
      this.quantity = quantity;
      this.price = price;
      this.desc = desc;
      this.productStatus = productStatus;
    }
  }

  class UI {
    static clearField() {
        document.getElementById("date").value = "";
        document.getElementById("orderNumber").value = "";
        document.getElementById("customerName").value = "";
        document.getElementById("orderTotal").value = "";
        document.getElementById("orderStatus").value = "";
        document.getElementById("item").value = "";
        document.getElementById("itemQuantity").value = "";
        document.getElementById("itemDesc").value = "";
        document.getElementById("itemPrice").value = "";
        document.getElementById("itemStatus").value = "";
    }
    
    static displayOrder(obj) {
      dynamicHere.insertAdjacentHTML(
        "afterbegin",
        `
          <tr class="${obj.itemNumber}">
          <td>${obj.date}</td>
          <td>${obj.orderNumber} </td>
          <td>${obj.customerName}</td>
          <td>${obj.orderTotal}</td>
          <td>${obj.orderStatus}</td>
          <td><button class='btn btn-info expandOrder' data-toggle="modal" data-target="#orderModal">View</button></td>
          <td><button class='btn btn-warning editOrder' data-toggle="modal" data-target="#orderEditModal">Edit</button></td>
          <td><button class='btn btn-danger' id='deleteOrder'>X</button></td>
          </tr>
          `
      );
    }

    static displayItem(obj) {
        dynamicItemsHere.insertAdjacentHTML(
            "afterbegin",
            `
                <tr class="${obj.itemNumber}" id="temp">
                <td>${obj.item}</td>
                <td>${obj.quantity} </td>
                <td>${obj.desc}</td>
                <td>${obj.price}</td>
                <td>${obj.productStatus}</td>
                <td><button class='btn btn-danger' id='deleteOrder'>X</button></td>
                </tr>
                `
          );
      }

    static message(txt, className, loc) {
      var divs = document.createElement("div");
      divs.classList = `alert alert-${className}`;
      divs.innerText = txt;

      cardbody.insertBefore(divs, loc);
      setInterval(function () {
        divs.remove();
      }, 2000);
    } 
  }
};