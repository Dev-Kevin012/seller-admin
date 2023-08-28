const Axios = axios.create({
  baseURL: "https://crudcrud.com/api/63eac1f0d9df4000bacd978ff06e4b1a/products",
});
const Toast = Swal.mixin({
  toast: true,
  position: "top-right",
  iconColor: "white",
  customClass: {
    popup: "colored-toast",
  },
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
});
let rowData = [];

const showData = () => {
  let html = "";
  Axios.get("/")
    .then((result) => {
      const tableBody = document.getElementById("table-body");
      const data = result.data;
      rowData = data;
      if (data.length > 0) {
        data.forEach((row, index) => {
          html += `<tr>
          <th scope="row">${index + 1}</th>
          <td>${row.product_name}</td>
          <td>${row.price}</td>
          <td>${row.category}</td>
          <td>
           <button class="btn btn-sm btn-danger" onclick="handleDelete('${
             row._id
           }')">Delete</button>
          </td>
        </tr>
        `;
        });
        tableBody.innerHTML = html;
      }
      const data_section = document.getElementById("data-section");
      if (data.length > 0) {
        data_section.classList.remove("d-none"); // Show data
      } else {
        data_section.classList.add("d-none"); // Hide data since there is nothing to show
      }
    })
    .catch((err) => {
      console.log(err);
    });
};
document.addEventListener("DOMContentLoaded", showData());

document.getElementById("form").addEventListener("submit", (e) => {
  e.preventDefault();

  const data = {
    product_name: e.target.product_name.value,
    price: e.target.price.value,
    category: e.target.category.value,
  };
  Axios.post("/", data)
    .then(() => {
      Swal.fire("Product Added!", "", "success");
      document.getElementById("Pname").value = "";
      document.getElementById("price").value = "";
      document.getElementById("category").value = "";
      showData();
    })
    .catch((err) => {
      Swal.fire("Failed to add Product!", "", "error");
    });
});

const handleDelete = (id) => {
  Swal.fire({
    title: "Are you sure?",
    text: "This product will be deleted!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#35A29F",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      Axios.delete(`/${id}`)
        .then(() => {
          Toast.fire({
            icon: "success",
            title: "Product Deleted !",
          });
          showData();
        })
        .catch(() => {
          Swal.fire("Something went Wrong!", "", "error");
        });
    }
  });
};

const categoryFilter = document.getElementById("categoryFilter");

categoryFilter.addEventListener("change", () => {
  const selectedCategory = categoryFilter.value;

  let filteredData = rowData;

  if (selectedCategory !== "all") {
    filteredData = rowData.filter((item) => item.category === selectedCategory);
  }

  let html = "";
  const tableBody = document.getElementById("table-body");

  if (filteredData.length > 0) {
    filteredData.forEach((row, index) => {
      html += `<tr>
      <th scope="row">${index + 1}</th>
      <td>${row.product_name}</td>
      <td>${row.price}</td>
      <td>${row.category}</td>
      <td>
       <button class="btn btn-sm btn-danger" onclick="handleDelete('${
         row._id
       }')">Delete</button>
      </td>
    </tr>`;
    });
    tableBody.innerHTML = html;
  } else {
    tableBody.innerHTML =
      "<tr class='text-center mx-auto'><td colspan='5'>No products found for the selected category!</td></tr>";
  }
});
