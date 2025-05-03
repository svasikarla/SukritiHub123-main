export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      apartments: {
        Row: {
          id: string
          block: string
          flat_number: string
          floor_number: number | null
          flat_type: string | null
          area_sqft: number | null
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          block: string
          flat_number: string
          floor_number?: number | null
          flat_type?: string | null
          area_sqft?: number | null
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          block?: string
          flat_number?: string
          floor_number?: number | null
          flat_type?: string | null
          area_sqft?: number | null
          status?: string
          created_at?: string
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
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          phone?: string | null
          email?: string | null
          apartment_id?: string | null
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          phone?: string | null
          email?: string | null
          apartment_id?: string | null
          status?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "residents_apartment_id_fkey"
            columns: ["apartment_id"]
            referencedRelation: "apartments"
            referencedColumns: ["id"]
          }
        ]
      }
      maintenance_bills: {
        Row: {
          id: string
          resident_id: string
          month_year: string
          amount_due: number
          due_date: string
          status: string
          generated_at: string
        }
        Insert: {
          id?: string
          resident_id: string
          month_year: string
          amount_due: number
          due_date: string
          status?: string
          generated_at?: string
        }
        Update: {
          id?: string
          resident_id?: string
          month_year?: string
          amount_due?: number
          due_date?: string
          status?: string
          generated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_bills_resident_id_fkey"
            columns: ["resident_id"]
            referencedRelation: "residents"
            referencedColumns: ["id"]
          }
        ]
      }
      payments: {
        Row: {
          id: string
          maintenance_bill_id: string
          paid_amount: number
          paid_on: string
          payment_mode: string
          transaction_id?: string
          payment_screenshot?: string
        }
        Insert: {
          id?: string
          maintenance_bill_id: string
          paid_amount: number
          paid_on: string
          payment_mode: string
          transaction_id?: string
          payment_screenshot?: string
        }
        Update: {
          id?: string
          maintenance_bill_id?: string
          paid_amount?: number
          paid_on?: string
          payment_mode?: string
          transaction_id?: string
          payment_screenshot?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_maintenance_bill_id_fkey"
            columns: ["maintenance_bill_id"]
            referencedRelation: "maintenance_bills"
            referencedColumns: ["id"]
          }
        ]
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

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Insertable<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type Updatable<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
