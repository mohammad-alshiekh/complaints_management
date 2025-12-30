import { NextRequest } from "next/server";
 import { ApiHelper } from "@/lib/api-helper";

export async function GET(request: NextRequest) {
      return ApiHelper.get(request, "/admin/agencies");
}

export async function POST(request: NextRequest) {
const body = await request.json();

 
const validationError = ApiHelper.validateBody(body, ["name"]);
      if (validationError) {
        return validationError;
      }

      return ApiHelper.post(request, "/admin/agencies", body);}

