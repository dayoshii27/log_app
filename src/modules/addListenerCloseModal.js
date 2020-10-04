export default () => {
  const body = document.querySelector("body");
  const modalArea = body.querySelector("#modal");
  const modalContents = modalArea.querySelector(".log-record");

  modalArea.addEventListener("click", () => {
    body.classList.remove("modal_opened");
  });

  modalContents.addEventListener("click", e => {
    e.stopPropagation();
  });
};
