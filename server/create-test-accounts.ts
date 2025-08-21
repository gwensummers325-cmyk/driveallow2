import { storage } from "./storage";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

export async function createTestAccounts() {
  try {
    // Create test parent account
    const parentPassword = await hashPassword("parent123");
    const parent = await storage.createUser({
      id: "test-parent-1",
      username: "testparent",
      email: "parent@test.com",
      firstName: "Sarah",
      lastName: "Johnson",
      role: "parent",
      password: parentPassword,
    });

    console.log("Created test parent:", parent.username);

    // Create test teen account linked to parent
    const teenPassword = await hashPassword("teen123");
    const teen = await storage.createUser({
      id: "test-teen-1", 
      username: "testteen",
      email: "teen@test.com",
      firstName: "Alex",
      lastName: "Johnson",
      role: "teen",
      password: teenPassword,
      parentId: parent.id,
    });

    console.log("Created test teen:", teen.username);

    // Create initial allowance settings
    await storage.upsertAllowanceSettings({
      parentId: parent.id,
      teenId: teen.id,
      weeklyAmount: "25.00",
      frequency: "weekly",
      allowOverdraft: true,
      speedingMinorPenalty: "5.00",
      speedingMajorPenalty: "10.00",
      harshBrakingPenalty: "3.00",
      aggressiveAccelPenalty: "3.00",
      weeklyBonus: "5.00",
      perfectWeekBonus: "10.00",
      speedComplianceBonus: "2.00",
    });

    // Create initial balance for teen
    await storage.upsertAllowanceBalance({
      teenId: teen.id,
      currentBalance: "25.00",
      lastAllowanceDate: new Date(),
      nextAllowanceDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
    });

    console.log("Test accounts created successfully!");
    console.log("Parent login: testparent / parent123");
    console.log("Teen login: testteen / teen123");

  } catch (error) {
    console.error("Error creating test accounts:", error);
  }
}