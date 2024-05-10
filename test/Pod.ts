import hre from "hardhat";
import { Pod__factory } from "../typechain-types";
import { BeaconChainProofs } from "../typechain-types/externalArtifacts/Pod";

describe("Pod", function () {
  it("get owner", async function () {
    const accounts = await hre.ethers.getSigners();
    const pod = Pod__factory.connect(
      "0x11f26DB96471005BFc0f8B46B46E39d4E1d9e311",
      accounts[0],
    );
    const owner = await pod.podOwner();
    console.log("Owner:", owner);
  }).timeout(360000);
  it("Restake", async function () {
    const accounts = await hre.ethers.getSigners();
    const pod = Pod__factory.connect(
      "0xFC071a0fd1649241D0b5365eeD01AA5EE783b87b",
      accounts[0],
    );
    console.log("hasRestake:", await pod.hasRestaked());
  });
});
