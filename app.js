 const BASE_URL = "https://api.frankfurter.app/latest";
    const dropdowns = document.querySelectorAll(".dropdown select");
    const fromCurr = document.querySelector(".from select");
    const toCurr = document.querySelector(".to select");
    const msg = document.querySelector(".msg");
    const btn = document.querySelector("form button");
    const swapBtn = document.getElementById("swap");

    // ✅ Populate Currency Dropdowns
    for (let select of dropdowns) {
      for (let curr in countryList) {
        let option = document.createElement("option");
        option.value = curr;
        option.textContent = curr;
        if (select.name === "from" && curr === "USD") option.selected = true;
        if (select.name === "to" && curr === "INR") option.selected = true;
        select.append(option);
      }
      select.addEventListener("change", e => updateFlag(e.target));
    }

    // ✅ Update Flag Image
    function updateFlag(element) {
      element.parentElement.querySelector("img").src = 
        `https://flagsapi.com/${countryList[element.value]}/flat/64.png`;
    }

    // ✅ Fetch Exchange Rate from Frankfurter API
    async function updateExchangeRate() {
      const amount = document.querySelector(".amount input").value || 1;
      const from = fromCurr.value;
      const to = toCurr.value;
      if (from === to) {
        msg.textContent = `${amount} ${from} = ${amount} ${to}`;
        return;
      }
      const res = await fetch(`${BASE_URL}?amount=${amount}&from=${from}&to=${to}`);
      const data = await res.json();
      const rate = data.rates[to];
      msg.textContent = `${amount} ${from} = ${rate.toFixed(2)} ${to}`;
    }

    // ✅ Button Click Event
    btn.addEventListener("click", e => {
      e.preventDefault();
      updateExchangeRate();
    });

    // ✅ Swap Functionality
    swapBtn.addEventListener("click", () => {
      [fromCurr.value, toCurr.value] = [toCurr.value, fromCurr.value];
      updateFlag(fromCurr);
      updateFlag(toCurr);
      updateExchangeRate();
    });

    // ✅ Initial Call
    window.addEventListener("load", updateExchangeRate);