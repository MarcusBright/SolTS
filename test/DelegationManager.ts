import hre from "hardhat";
import { DelegationManager__factory } from "../typechain-types";
import { IDelegationManager } from "../typechain-types/externalArtifacts/DelegationManager";

describe("DelegationManager", function () {
  it("cumulativeWithdrawalsQueued", async function () {
    const podOwner = "0x7F1fbA3D5572a8A267c236D28b492f388c4dB002";
    const accounts = await hre.ethers.getSigners();
    const dm = DelegationManager__factory.connect(
      "0xA44151489861Fe9e3055d95adC98FbD462B948e7",
      accounts[0],
    );
    const cumulativeWithdrawalsQueued =
      await dm.cumulativeWithdrawalsQueued(podOwner);
    console.log("cumulativeWithdrawalsQueued:", cumulativeWithdrawalsQueued);
  }).timeout(360000);

  it("WithdrawalsQueued", async function () {
    const podOwner = "0x7F1fbA3D5572a8A267c236D28b492f388c4dB002";
    const accounts = await hre.ethers.getSigners();
    const dm = DelegationManager__factory.connect(
      "0xA44151489861Fe9e3055d95adC98FbD462B948e7",
      accounts[0],
    );
    //IDelegationManager.QueuedWithdrawalParamsStruct[]
    const qwps: IDelegationManager.QueuedWithdrawalParamsStruct = {
      strategies: ["0xbeaC0eeEeeeeEEeEeEEEEeeEEeEeeeEeeEEBEaC0"],
      shares: [hre.ethers.parseEther("15")],
      withdrawer: podOwner,
    };
    const tx = await dm.queueWithdrawals([qwps]);
    const txReciept = await tx.wait();
    //0x21aed1539909f0891e674e883bac02e6288a050c1f3a9df950228a05ce04df0a
    console.log(txReciept!.hash);
  }).timeout(360000);

  it.only("CompleteWithdrawalsQueued", async function () {
    const podOwner = "0x7F1fbA3D5572a8A267c236D28b492f388c4dB002";
    const accounts = await hre.ethers.getSigners();
    const dm = DelegationManager__factory.connect(
      "0xA44151489861Fe9e3055d95adC98FbD462B948e7",
      accounts[0],
    );
    const logs = await dm.queryFilter(
      dm.filters.WithdrawalQueued,
      1494315,
      1494315,
    );
    const wqstruct = dm.interface.decodeEventLog(
      dm.filters.WithdrawalQueued.fragment,
      logs[0].data,
      logs[0].topics,
    );
    console.log("wqstruct:", wqstruct);

    const ws: IDelegationManager.WithdrawalStruct = {
      staker: wqstruct.withdrawal.staker,
      delegatedTo: wqstruct.withdrawal.delegatedTo,
      withdrawer: wqstruct.withdrawal.withdrawer,
      nonce: wqstruct.withdrawal.nonce,
      startBlock: wqstruct.withdrawal.startBlock,
      strategies: [...wqstruct.withdrawal.strategies],
      shares: [...wqstruct.withdrawal.shares],
    };
    console.log("ws:", ws);
    const tokens: string[] = ["0x0000000000000000000000000000000000000000"];
    const tx = await dm.completeQueuedWithdrawals([ws], [tokens], [0], [false]);
    //const tx = await dm.completeQueuedWithdrawal(ws,tokens,BigInt(0),false)
    const txReceipt = await tx.wait();
    console.log(txReceipt!.hash);
  }).timeout(360000);
});
