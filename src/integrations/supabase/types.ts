export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      Guard: {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: number
        }
        Update: {
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      Guards: {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: number
        }
        Update: {
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      "Maid Attendance": {
        Row: {
          apartment_unit: string | null
          created_at: string
          entry_time: string | null
          exit_time: string | null
          face_match_confidence: number | null
          id: number
          maid_id: number | null
          status: string | null
        }
        Insert: {
          apartment_unit?: string | null
          created_at?: string
          entry_time?: string | null
          exit_time?: string | null
          face_match_confidence?: number | null
          id?: number
          maid_id?: number | null
          status?: string | null
        }
        Update: {
          apartment_unit?: string | null
          created_at?: string
          entry_time?: string | null
          exit_time?: string | null
          face_match_confidence?: number | null
          id?: number
          maid_id?: number | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Maid Attendance_maid_id_fkey"
            columns: ["maid_id"]
            isOneToOne: false
            referencedRelation: "Maids"
            referencedColumns: ["id"]
          },
        ]
      }
      Maids: {
        Row: {
          apartment_unit: string | null
          created_at: string
          "Face Descriptor": Json | null
          face_descriptor: Json | null
          id: number
          "Name of Maid": string | null
          phone_number: string | null
        }
        Insert: {
          apartment_unit?: string | null
          created_at?: string
          "Face Descriptor"?: Json | null
          face_descriptor?: Json | null
          id?: number
          "Name of Maid"?: string | null
          phone_number?: string | null
        }
        Update: {
          apartment_unit?: string | null
          created_at?: string
          "Face Descriptor"?: Json | null
          face_descriptor?: Json | null
          id?: number
          "Name of Maid"?: string | null
          phone_number?: string | null
        }
        Relationships: []
      }
      "Night Patrol Beat": {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: number
        }
        Update: {
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      residents: {
        Row: {
          id: string
          name: string
          phone: string | null
          email: string | null
          apartment_id: string | null
          status: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          name: string
          phone?: string | null
          email?: string | null
          apartment_id?: string | null
          status?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          phone?: string | null
          email?: string | null
          apartment_id?: string | null
          status?: string | null
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "residents_apartment_id_fkey"
            columns: ["apartment_id"]
            isOneToOne: false
            referencedRelation: "apartments"
            referencedColumns: ["id"]
          }
        ]
      }
      apartments: {
        Row: {
          id: string
          block: string
          flat_number: string
          floor_number: number | null
          flat_type: string | null
          area_sqft: number | null
          status: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          block: string
          flat_number: string
          floor_number?: number | null
          flat_type?: string | null
          area_sqft?: number | null
          status?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          block?: string
          flat_number?: string
          floor_number?: number | null
          flat_type?: string | null
          area_sqft?: number | null
          status?: string | null
          created_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
