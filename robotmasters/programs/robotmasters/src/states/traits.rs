use bolt_lang::prelude::*;

pub trait FromAccountInfo: AnchorDeserialize {
    fn from_account_info(account_info: &AccountInfo) -> Result<Self> {
        // Borrow data and skip the 8-byte discriminator
        let borrowed_data = &account_info.try_borrow_data()?[8..];
        // Deserialize the remaining data
        Self::try_from_slice(borrowed_data).map_err(|_| ProgramError::InvalidAccountData.into())
    }
}
