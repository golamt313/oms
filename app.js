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

  orderForm.addEventListener("submit", function (e) {
    e.preventDefault();
    date = document.getElementById("date").value;
    orderNumber = document.getElementById("orderNumber").value;
    customerName = document.getElementById("customerName").value;
    orderTotal = document.getElementById("orderTotal").value;
    orderStatus = document.getElementById("orderStatus").value;

    if (
      date == "" ||
      orderNumber == "" ||
      customerName == "" ||
      orderTotal == "" ||
      orderStatus == ""
    ) {
      UI.message("Input FIeld Cannot Be Blank", "danger", orderForm);
    } else {
      db.collection("orders").doc(orderNumber).set({
        date: date,
        orderNumber: orderNumber,
        customerName: customerName,
        orderTotal: orderTotal,
        orderStatus: orderStatus,
      });
      UI.displayOrder(
        new order(date, orderNumber, customerName, orderTotal, orderStatus)
      );
      UI.clearField();
      UI.message("Order Added", "success", orderForm);
    }
  });

  db.collection("orders")
    .get()
    .then((snapshot) => {
      snapshot.docs.forEach((doc) => {
        orderObj = new order(
          doc.data().date,
          doc.data().orderNumber,
          doc.data().customerName,
          doc.data().orderTotal,
          doc.data().orderStatus
        );
        UI.displayOrder(orderObj);
      });
    });

  dynamicHere.addEventListener("click", function (e) {
    element = e.target;

    UI.action(element);
    UI.message("Order Removed", "success", orderForm);
  });

  itemForm.addEventListener("submit", function (e) {
    e.preventDefault();
    orderNumber = document.getElementById('modalLabel').innerHTML.match(/\d+/);
    orderNumber = orderNumber[0]
    itemNumber = ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
      );
    item = document.getElementById("item").value;
    quantity = document.getElementById("itemQuantity").value;
    desc = document.getElementById("itemDesc").value;
    price = document.getElementById("itemPrice").value;
    productStatus = document.getElementById("itemStatus").value;
    if (
        itemNumber == "" ||
        item == "" ||
        quantity == "" ||
        itemDesc == "" ||
        itemPrice == "" ||
        itemStatus == ""
    ) {
      alert("Input FIeld Cannot Be Blank");
    } else {
      db.collection("orders").doc(orderNumber).collection("meta").doc(itemNumber).set({
        itemNumber: itemNumber,
        item: item,
        quantity: quantity,
        desc: desc,
        price: price,
        productStatus: productStatus,
      });
      UI.displayItem(
        new product(itemNumber, item, quantity, price, desc, productStatus)
      );
      UI.clearField();
    }
  });

  dynamicItemsHere.addEventListener("click", function (e) {
    element = e.target;

    UI.itemAction(element);
    UI.message("Item Removed", "success", orderForm);
  });

  orderEditForm.addEventListener("submit", function (el) {
    el.preventDefault();
    oringinalOrderNumber = document.getElementById("orderInfo").getElementsByTagName("td")[1].innerHTML.trim();
    date = document.getElementById("updateDate").value;
    orderNumber = document.getElementById("updateOrderNumber").value;
    customerName = document.getElementById("updateCustomerName").value;
    orderTotal = document.getElementById("updateOrderTotal").value;
    orderStatus = document.getElementById("updateOrderStatus").value;

    if (
      date == "" ||
      orderNumber == "" ||
      customerName == "" ||
      orderTotal == "" ||
      orderStatus == ""
    ) {
      alert("Input FIeld Cannot Be Blank");
    } else if(orderNumber != oringinalOrderNumber){
      db.collection("orders").doc(orderNumber).set({
        date: date,
        orderNumber: orderNumber,
        customerName: customerName,
        orderTotal: orderTotal,
        orderStatus: orderStatus,
      });
      db.collection("orders").doc(oringinalOrderNumber).delete();
      document.getElementById("orderInfo").getElementsByTagName("td")[0].innerHTML = date
      document.getElementById("orderInfo").getElementsByTagName("td")[1].innerHTML = orderNumber
      document.getElementById("orderInfo").getElementsByTagName("td")[2].innerHTML = customerName
      document.getElementById("orderInfo").getElementsByTagName("td")[3].innerHTML = orderTotal
      document.getElementById("orderInfo").getElementsByTagName("td")[4].innerHTML = orderStatus
      alert("Updated Successfully!")
    } else {
      db.collection("orders").doc(oringinalOrderNumber).update({
        date: date,
        orderNumber: orderNumber,
        customerName: customerName,
        orderTotal: orderTotal,
        orderStatus: orderStatus,
      });
      document.getElementById("orderInfo").getElementsByTagName("td")[0].innerHTML = date
      document.getElementById("orderInfo").getElementsByTagName("td")[1].innerHTML = orderNumber
      document.getElementById("orderInfo").getElementsByTagName("td")[2].innerHTML = customerName
      document.getElementById("orderInfo").getElementsByTagName("td")[3].innerHTML = orderTotal
      document.getElementById("orderInfo").getElementsByTagName("td")[4].innerHTML = orderStatus
      alert("Updated Successfully!")
    }
  });

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
          <td><button class='btn btn-danger closeBTN'>X</button></td>
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
                <td><button class='btn btn-danger closeItem'>X</button></td>
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

    static itemAction(el) {
        var orderNumber = document.getElementById('modalLabel').innerHTML.match(/\d+/);
        orderNumber = orderNumber[0] 
        var itemNumber = document.getElementsByTagName("tr")[1].className
        if(el.classList.contains("closeItem")){
            db.collection("orders").doc(orderNumber).collection("meta").doc(itemNumber).delete();
            el.parentElement.parentElement.remove()
        }
    }

    static action(el) {
      var cells = el.parentElement.parentElement.getElementsByTagName("td");
      var date = cells[0].innerHTML.trim();
      var orderNumber = cells[1].innerHTML.trim();
      var customerName = cells[2].innerHTML;
      var price = cells[3].innerHTML.trim();
      var status = cells[4].innerHTML.trim();
      if (el.classList.contains("closeBTN")) {
        db.collection("orders").doc(orderNumber).delete();
        el.parentElement.parentElement.remove();
      } else if(el.classList.contains("saveOrder")) {
        date = document.getElementById('date').value
        orderNumber = document.getElementById('orderNumber').value
        customerName = document.getElementById('customerName').value
        price = document.getElementById('price').value
        status = document.getElementById('orderStatus').value

        if (
            date == "" ||
            orderNumber == "" ||
            customerName == "" ||
            price == "" ||
            status == ""
          ) {
            UI.message("Input FIeld Cannot Be Blank", "danger", orderForm);
          } else {
            db.collection("orders").doc(orderNumber).set({
              date: date,
              orderNumber: orderNumber,
              customerName: customerName,
              orderTotal: price,
              orderStatus: status,
            });
            UI.displayOrder(
              new order(date, orderNumber, customerName, orderTotal, orderStatus)
            );
          }

      }else if(el.classList.contains("editOrder")) {
       dynamicOrderInfo.innerHTML =
        `
            <tr>
            <td>${date}</td>
            <td>${orderNumber}</td>
            <td>${customerName}</td>
            <td>${price}</td>
            <td>${status}</td>
            </tr>
            `
      }else if (el.classList.contains("expandOrder")) {
        document.getElementById("modalLabel").innerHTML =
          "Order #" + orderNumber + " - " + customerName;
        db.collection("orders")
          .doc(orderNumber)
          .collection("meta")
          .get()
          .then((snapshot) => {
            snapshot.docs.forEach((doc) => {
              var productObj = new product(
                doc.data().itemNumber,
                doc.data().item,
                doc.data().quantity,
                doc.data().price,
                doc.data().desc,
                doc.data().productStatus
              );
              dynamicItemsHere.insertAdjacentHTML(
                "afterbegin",
                `
                    <tr class="${productObj.itemNumber}" id="temp">
                    <td>${productObj.item}</td>
                    <td>${productObj.quantity} </td>
                    <td>${productObj.desc}</td>
                    <td>${productObj.price}</td>
                    <td>${productObj.productStatus}</td>
                    <td><button class='btn btn-danger closeItem'>X</button></td>
                    </tr>
                    `
              );
            });
          });
      }
      while(document.getElementById("temp")) {
        document.getElementById("temp").remove();
      }
    }
  }
};