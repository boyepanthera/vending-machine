import chai from "chai";
import chaiHttp from "chai-http";
import { server } from "../src/server";
import User from "../src/models/user.model";
import Product from "../src/models/product.model";
const should = chai.should();
const expect = chai.expect;

chai.use(chaiHttp);

// describe("Test User Login", function () {
//   this.retries(2);
// });

describe("/POST user", () => {
  let buyerToken;
  let sellerToken;
  let productToBuy;
  let trashProductList = [];
  // For Seller account creation
  it("it should create a seller account", (done) => {
    chai
      .request(server)
      .post("/api/v1/user")
      .send({
        username: "BoyepantheraTestSeller",
        password: "Akorede",
        role: "seller",
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body.data).to.haveOwnProperty("role");
        expect(res.body.data).to.haveOwnProperty("token");
        res.body.data.role.should.be.eql("seller");
        sellerToken = res.body.data.token;
        done();
      });
  });

  it("it should create a buyer account", (done) => {
    chai
      .request(server)
      .post("/api/v1/user")
      .send({
        username: "BoyepantheraTestBuyer",
        password: "Akorede",
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body.data).to.haveOwnProperty("role");
        expect(res.body.data).to.haveOwnProperty("token");
        res.body.data.role.should.be.eql("buyer");
        buyerToken = res.body.data.token;
        done();
      });
  });

  it("it should fetch user profile", (done) => {
    chai
      .request(server)
      .get("/api/v1/user")
      .set({
        Authorization: "Bearer " + buyerToken,
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.data.user).to.haveOwnProperty("_id");
        expect(res.body.data.user).to.haveOwnProperty("role");
        expect(res.body.data.user).to.haveOwnProperty("username");
        res.body.data.user.role.should.be.eql("buyer");
        done();
      });
  });

  it("it should update user profile", (done) => {
    chai
      .request(server)
      .put("/api/v1/user")
      .set({ Authorization: "Bearer " + buyerToken })
      .send({
        firstName: "BoyeTest",
        lastName: "LanreTest",
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.data).to.haveOwnProperty("firstName");
        expect(res.body.data).to.haveOwnProperty("lastName");
        done();
      });
  });

  it("it should deposit into buyer walllet", (done) => {
    chai
      .request(server)
      .post("/api/v1/deposit")
      .set({ Authorization: "Bearer " + buyerToken })
      .send({
        amount: 50,
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body.data.deposit).to.haveOwnProperty("amount");
        expect(res.body.data.deposit).to.haveOwnProperty("depositor");
        expect(res.body.data.deposit.amount).to.eql(50);
        done();
      });
  });

  it("it should add product to vending machine", (done) => {
    chai
      .request(server)
      .post("/api/v1/product")
      .set({ Authorization: "Bearer " + sellerToken })
      .send({
        productName: "Bournvita",
        amountAvailable: 100,
        cost: 15,
      })
      .end((err, res) => {
        productToBuy = res.body.data.product._id;
        trashProductList.push(productToBuy);
        expect(res).to.have.status(201);
        expect(res.body.data.product).to.haveOwnProperty("sellerId");
        expect(res.body.data.product).to.haveOwnProperty("productName");
        expect(res.body.data.product).to.haveOwnProperty("amountAvailable");
        expect(res.body.data.product.amountAvailable).to.eql(100);
        expect(res.body.data.product.productName).to.eql("Bournvita");
        expect(res.body.data.product.cost).to.eql(15);
        done();
      });
  });

  it("it should buy product", (done) => {
    chai
      .request(server)
      .post("/api/v1/buy")
      .set({ Authorization: "Bearer " + buyerToken })
      .send({
        amount: 2,
        productId: productToBuy,
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body.data.buy).to.haveOwnProperty("product");
        expect(res.body.data.buy).to.haveOwnProperty("buyerId");
        expect(res.body.data.buy).to.haveOwnProperty("amount");
        expect(res.body.data.buy).to.haveOwnProperty("subTotal");
        expect(res.body.data.buy.amount).to.eql(2);
        expect(res.body.data.buy.subTotal).to.eql(30);
        done();
      });
  });

  it("it should delete user profile", (done) => {
    chai
      .request(server)
      .delete("/api/v1/user")
      .set({ Authorization: "Bearer " + buyerToken })
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });

  after(async function () {
    try {
      await User.deleteMany({
        username: { $in: ["BoyepantheraTestSeller", "BoyepantheraTestBuyer"] },
      });
      await Product.deleteMany({
        _id: { $in: trashProductList },
      });
    } catch (err) {
      console.log("issues connecting to test db");
    }
  });
});
