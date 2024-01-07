const fetch = require("node-fetch");

const baseUrl =
  "https://api.localshop.vn/nice-phone-number/api/phone-number/get-all?Alias=*${0}&ConceptType=0&Status=2&OrderType=desc&OrderBy=price&Limit=250";
const token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."; // Token của bạn

for (let i = 0; i <= 9; i++) {
  for (let j = 0; j <= 9; j++) {
    const s = `${i}${i}${i}${j}${j}${j}`;
    const url = baseUrl.replace("${0}", s);

    fetch(url, {
      method: "GET",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
        // Các headers khác nếu cần thiết
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Network response was not ok.");
      })
      .then((data) => {
       console.log(data);
      })
      .catch((error) => {
        // Xử lý lỗi
        console.error("There was a problem with the fetch operation:", error);
      });
      //break;
  }
}
