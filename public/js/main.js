document.querySelector(".delete-article").addEventListener("click", async function (e) {
    const id = e.target.getAttribute("data-id");
    await axios.delete("/articles/" + id);
    window.location.href = "/";
})