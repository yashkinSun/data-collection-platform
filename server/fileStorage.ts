import fs from "fs/promises";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data", "submissions");
const FALLBACK_DIR = path.join(process.cwd(), "data", "fallback");

// Ensure directories exist
async function ensureDir(dir: string) {
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (error) {
    console.error(`Failed to create directory ${dir}:`, error);
  }
}

// Save submission as JSON file
export async function saveSubmissionJSON(id: string, data: any): Promise<string> {
  await ensureDir(DATA_DIR);
  const filePath = path.join(DATA_DIR, `${id}.json`);
  
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
    return filePath;
  } catch (error) {
    console.error(`Failed to save submission ${id}:`, error);
    
    // Fallback: save to fallback directory
    await ensureDir(FALLBACK_DIR);
    const fallbackPath = path.join(FALLBACK_DIR, `${id}.json`);
    await fs.writeFile(fallbackPath, JSON.stringify(data, null, 2), "utf-8");
    
    throw new Error(`Failed to save submission, saved to fallback: ${fallbackPath}`);
  }
}

// Read submission from JSON file
export async function readSubmissionJSON(id: string): Promise<any> {
  const filePath = path.join(DATA_DIR, `${id}.json`);
  
  try {
    const content = await fs.readFile(filePath, "utf-8");
    return JSON.parse(content);
  } catch (error) {
    console.error(`Failed to read submission ${id}:`, error);
    return null;
  }
}

// Append submission to CSV aggregate file
export async function appendSubmissionCSV(data: any): Promise<void> {
  await ensureDir(DATA_DIR);
  const csvPath = path.join(DATA_DIR, "all_submissions.csv");
  
  try {
    // Check if file exists to determine if we need headers
    let fileExists = false;
    try {
      await fs.access(csvPath);
      fileExists = true;
    } catch {
      fileExists = false;
    }
    
    // Flatten the data structure for CSV
    const flatData = flattenObject(data);
    
    // Create CSV row
    const headers = Object.keys(flatData);
    const values = Object.values(flatData).map(v => 
      typeof v === 'string' ? `"${v.replace(/"/g, '""')}"` : v
    );
    
    let csvContent = "";
    if (!fileExists) {
      csvContent = headers.join(",") + "\n";
    }
    csvContent += values.join(",") + "\n";
    
    await fs.appendFile(csvPath, csvContent, "utf-8");
  } catch (error) {
    console.error("Failed to append to CSV:", error);
  }
}

// Helper function to flatten nested objects for CSV
function flattenObject(obj: any, prefix = ""): Record<string, any> {
  const flattened: Record<string, any> = {};
  
  for (const key in obj) {
    const value = obj[key];
    const newKey = prefix ? `${prefix}.${key}` : key;
    
    if (value === null || value === undefined) {
      flattened[newKey] = "";
    } else if (typeof value === "object" && !Array.isArray(value)) {
      Object.assign(flattened, flattenObject(value, newKey));
    } else if (Array.isArray(value)) {
      flattened[newKey] = JSON.stringify(value);
    } else {
      flattened[newKey] = value;
    }
  }
  
  return flattened;
}

