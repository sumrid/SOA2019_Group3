<template>
  <div>
    <navbar></navbar>

    <div class="content-selection">
      <div class="container">
        <div class="card-deck">
          <div class="card">
            <div class="card-body text-center">
              <h4 class="card-title anakotmai-medium-text">{{ catalogy.sick }}</h4>
              <h5 class="text-left anakotmai-medium-text">หมายเหตุ</h5>
              <ul>
                <li
                  class="text-left anakotmai-medium-text"
                >การลาป่วยในระหว่างเรียน นักศึกษาต้องยื่นใบลาในวันแรกที่กลับเข้ามาเรียน ในกรณีลาป่วยตั้งแต่ 5 วันขึ้นไปต้องมีใบรับรองแพทย์โดยยื่นต่ออาจารย์ประจำวิชา</li>
              </ul>
            </div>
            <div class="card-footer">
              <a href="#" class="card-link footer">
                <button
                  id="sick"
                  type="button"
                  class="btn btn-success anakotmai-medium-text"
                  @click="isSick()"
                >{{ catalogy.select }}</button>
              </a>
            </div>
          </div>
          <div class="card">
            <div class="card-body text-center">
              <h4 class="card-title anakotmai-medium-text">{{ catalogy.personal }}</h4>
              <h5 class="text-left anakotmai-medium-text">หมายเหตุ</h5>
              <ul>
                <li
                  class="text-left anakotmai-medium-text"
                >นักศึกษาที่จำเป็นต้องลาระหว่างชั่วโมงเรียนต้องขออนุญาตจากอาจารย์ประจำวิชานั้น</li>
                <li class="text-left anakotmai-medium-text">
                  นักศึกษาที่จะต้องลากิจตั้งแต่ 1 วันขึ้นไป ต้องยื่นใบลา
                  <u>ก่อน</u> วันลาพร้อมด้วยเหตุผลและคำรับรองของผู้ปกครองหรืออาจารย์ที่ปรึกษาอย่างใดอย่างหนึ่ง โดยยื่นต่ออาจารย์ประจำวิชา
                </li>
              </ul>
            </div>
            <div class="card-footer">
              <a href="#" class="selection-card-link footer">
                <button
                  id="personal"
                  type="button"
                  class="btn btn-success anakotmai-medium-text"
                  @click="isPersonal()"
                >{{ catalogy.select }}</button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <footer class="selection">
      <img
        src="../assets/images/logo-eleaving-with-text.png"
        class="img-fluid footer-logo"
        width="10%"
        height="10%"
      >
    </footer>
  </div>
</template>

<script>
import router from "../router";
import Navbar from "@/components/Navbar";

var accountObj;

export default {
  name: "Selection",
  components: {
    Navbar: Navbar
  },
  beforeCreate() {
    document.body.className = "";
    accountObj = JSON.parse(localStorage.getItem("account"));
    if(accountObj.account_type == 'professor') {
      alert("คุณไม่มีสิทธิ์เข้าถึงหน้านี้.")
      router.push({ name: "Login" })
    }
  },
  created() {
    document.title =
      ".:: เลือกประเภทการลา - ระบบลาเรียนออนไลน์ | คณะเทคโนโลยีสารสนเทศ ::.";
    localStorage.removeItem("catalog", "sick");
    localStorage.removeItem("catalog", "personal");
  },
  data() {
    return {
      catalogy: {
        sick: "ลาป่วย",
        personal: "ลากิจ",
        select: "เลือก"
      },
      studentCondition: undefined
    };
  },
  methods: {
    isSick() {
      localStorage.setItem("catalog", "ลาป่วย");
      router.push({ name: "Leave" });
    },
    isPersonal() {
      localStorage.setItem("catalog", "ลากิจ");
      router.push({ name: "Leave" });
    }
  }
};
</script>

<style scoped>
.footer-logo {
  margin-top: 1rem;
  margin-bottom: 1rem;
}
.content-selection {
  margin-top: 15vh;
  margin-bottom: 12vh;
}

.card {
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  position: relative;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-direction: column;
  flex-direction: column;
  min-width: 0;
  word-wrap: break-word;
  background-color: rgb(240, 238, 238);
  background-clip: border-box;
  border: 0;
  border-radius: 0;
  z-index: 2;
}

.card-footer {
  background-color: rgb(240, 238, 238);
  background-clip: border-box;
  border-top: 0;
}

footer.selection {
  position: fixed;
  left: 0;
  bottom: 0;
  min-width: 100%;
  width: auto;
  left: -10%;
  right: -10%;
}
</style>


